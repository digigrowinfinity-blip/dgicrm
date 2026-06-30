
const supabase = require('./supabase');
const axios = require('axios');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const FRONTEND_URL = process.env.CLIENT_URL || 'https://dgicrm.vercel.app';

// ── Step 1: Redirect user to Facebook Login ───────────────────────────────
const getFacebookLoginURL = (_req, res) => {
  const scopes = [
    'email',
    'ads_read',
    'ads_management',
    'leads_retrieval',
    'pages_show_list',
    'pages_read_engagement',
    'business_management',
  ].join(',');

  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&scope=${scopes}&response_type=code`;

  res.json({ success: true, url });
};

// ── Step 2: Handle Facebook callback ─────────────────────────────────────
const handleFacebookCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=facebook_cancelled`);
    }

    // Exchange code for access token
    const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenRes.data;

    // Get user info
    const userRes = await axios.get('https://graph.facebook.com/v19.0/me', {
      params: {
        fields: 'id,name,email',
        access_token,
      },
    });

    const { id: fb_id, name, email } = userRes.data;

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_email`);
    }

    // Find or create user in Supabase
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({ name, email, role: 'Agent', password: `fb_${Date.now()}` })
        .select('*')
        .single();
      user = newUser;
    }

    // Save Facebook token & pages for this user
    await supabase
      .from('facebook_connections')
      .upsert({
        user_id: user.id,
        fb_user_id: fb_id,
        access_token,
        name,
        email,
        updated_at: new Date(),
      }, { onConflict: 'user_id' });

    // Generate JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/facebook-callback?token=${token}&name=${encodeURIComponent(user.name)}&role=${user.role}&id=${user.id}&email=${encodeURIComponent(user.email)}`);

  } catch (err) {
    console.error('Facebook callback error:', err.message);
    res.redirect(`${FRONTEND_URL}/login?error=facebook_failed`);
  }
};

// ── Step 3: Get user's Facebook Pages ────────────────────────────────────
const getFacebookPages = async (req, res) => {
  try {
    const { data: conn } = await supabase
      .from('facebook_connections')
      .select('access_token')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) {
      return res.status(400).json({ success: false, message: 'Facebook not connected' });
    }

    const pagesRes = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: { access_token: conn.access_token, fields: 'id,name,access_token' },
    });

    res.json({ success: true, pages: pagesRes.data.data });
  } catch (err) {
    console.error('getPages error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Step 4: Get Ad Accounts ───────────────────────────────────────────────
const getAdAccounts = async (req, res) => {
  try {
    const { data: conn } = await supabase
      .from('facebook_connections')
      .select('access_token, fb_user_id')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) return res.status(400).json({ success: false, message: 'Facebook not connected' });

    const adRes = await axios.get(`https://graph.facebook.com/v19.0/${conn.fb_user_id}/adaccounts`, {
      params: { access_token: conn.access_token, fields: 'id,name,account_status' },
    });

    res.json({ success: true, adAccounts: adRes.data.data });
  } catch (err) {
    console.error('getAdAccounts error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Step 5: Get Campaigns ─────────────────────────────────────────────────
const getCampaigns = async (req, res) => {
  try {
    const { ad_account_id } = req.params;
    const { data: conn } = await supabase
      .from('facebook_connections')
      .select('access_token')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) return res.status(400).json({ success: false, message: 'Facebook not connected' });

    const campRes = await axios.get(`https://graph.facebook.com/v19.0/${ad_account_id}/campaigns`, {
      params: { access_token: conn.access_token, fields: 'id,name,status' },
    });

    res.json({ success: true, campaigns: campRes.data.data });
  } catch (err) {
    console.error('getCampaigns error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Step 6: Get Lead Forms ────────────────────────────────────────────────
const getLeadForms = async (req, res) => {
  try {
    const { page_id } = req.params;
    const { data: conn } = await supabase
      .from('facebook_connections')
      .select('access_token')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) return res.status(400).json({ success: false, message: 'Facebook not connected' });

    const formsRes = await axios.get(`https://graph.facebook.com/v19.0/${page_id}/leadgen_forms`, {
      params: { access_token: conn.access_token, fields: 'id,name,status' },
    });

    res.json({ success: true, forms: formsRes.data.data });
  } catch (err) {
    console.error('getLeadForms error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Step 7: Subscribe Webhook to Page ────────────────────────────────────
const subscribeWebhook = async (req, res) => {
  try {
    const { page_id } = req.body;

    const { data: conn } = await supabase
      .from('facebook_connections')
      .select('access_token')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) return res.status(400).json({ success: false, message: 'Facebook not connected' });

    // Get page access token
    const pageRes = await axios.get(`https://graph.facebook.com/v19.0/${page_id}`, {
      params: { fields: 'access_token', access_token: conn.access_token },
    });
    const pageToken = pageRes.data.access_token;

    // Subscribe to leadgen webhook
    await axios.post(
      `https://graph.facebook.com/v19.0/${page_id}/subscribed_apps`,
      null,
      { params: { subscribed_fields: 'leadgen', access_token: pageToken } }
    );

    // Save connection details
    await supabase
      .from('facebook_connections')
      .update({ page_id, page_token: pageToken })
      .eq('user_id', req.user.id);

    res.json({ success: true, message: 'Webhook subscribed successfully' });
  } catch (err) {
    console.error('subscribeWebhook error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Step 8: Webhook Receiver (incoming leads) ─────────────────────────────
const webhookVerify = (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'metalead_webhook_2024';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

const webhookReceive = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            const pageId = change.value.page_id;
            const formId = change.value.form_id;

            // Find connection for this page
            const { data: conn } = await supabase
              .from('facebook_connections')
              .select('*')
              .eq('page_id', pageId)
              .single();

            if (!conn) continue;

            // Fetch lead data from Facebook
            const leadRes = await axios.get(`https://graph.facebook.com/v19.0/${leadgenId}`, {
              params: {
                fields: 'field_data,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id',
                access_token: conn.page_token,
              },
            });

            const leadData = leadRes.data;
            const fields = {};
            leadData.field_data?.forEach(f => { fields[f.name] = f.values?.[0] || '' });

            // Insert lead into Supabase
            await supabase.from('leads').insert({
              name: fields['full_name'] || fields['name'] || 'Unknown',
              phone: fields['phone_number'] || fields['phone'] || '',
              email: fields['email'] || '',
              city: fields['city'] || '',
              campaign_name: leadData.campaign_name || '',
              ad_name: leadData.ad_name || '',
              adset_name: leadData.adset_name || '',
              form_name: formId,
              status: 'New',
              source: 'Meta Ads',
              meta_lead_id: leadgenId,
            });

            console.log(`✅ New lead captured: ${fields['full_name'] || 'Unknown'}`);
          }
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    console.error('webhookReceive error:', err.message);
    res.status(500).send('ERROR');
  }
};

module.exports = {
  getFacebookLoginURL,
  handleFacebookCallback,
  getFacebookPages,
  getAdAccounts,
  getCampaigns,
  getLeadForms,
  subscribeWebhook,
  webhookVerify,
  webhookReceive,
};
