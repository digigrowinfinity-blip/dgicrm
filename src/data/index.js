export const leads = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@gmail.com', city: 'Mumbai', campaign: 'Meta Ads Q1 2024', ad: 'Lead Gen Ad v2', adSet: 'Mumbai Audience', form: 'Business Enquiry Form', status: 'New', assignedTo: 'Priya Singh', createdAt: '2024-03-15', metaAnswers: [{ q: 'Business Type', a: 'Manufacturer' }, { q: 'Monthly Revenue', a: '₹10 Lakh' }, { q: 'Employees', a: '25' }, { q: 'Website', a: 'rahulbiz.com' }, { q: 'Need Website', a: 'Yes' }, { q: 'Interested Service', a: 'Meta Ads' }], notes: [{ id: 1, text: 'Interested in Meta Ads package. Will call back tomorrow.', author: 'Priya Singh', date: '2024-03-15 10:30' }], activities: [{ id: 1, type: 'Lead Created', desc: 'Lead created from Meta Instant Form', date: '2024-03-15 09:00' }, { id: 2, type: 'Assigned', desc: 'Assigned to Priya Singh', date: '2024-03-15 09:05' }], followUp: { date: '2024-03-18', time: '11:00', note: 'Call about Meta Ads pricing' } },
  { id: 2, name: 'Anjali Mehta', phone: '+91 87654 32109', email: 'anjali.mehta@outlook.com', city: 'Delhi', campaign: 'Summer Campaign', ad: 'Awareness Ad', adSet: 'Delhi NCR', form: 'Contact Form', status: 'Contacted', assignedTo: 'Amit Kumar', createdAt: '2024-03-14', metaAnswers: [{ q: 'Business Type', a: 'Retailer' }, { q: 'Monthly Revenue', a: '₹5 Lakh' }, { q: 'Employees', a: '10' }, { q: 'Interested Service', a: 'Website Design' }], notes: [], activities: [{ id: 1, type: 'Lead Created', desc: 'Lead created from Meta Instant Form', date: '2024-03-14 14:00' }], followUp: null },
  { id: 3, name: 'Vikram Patel', phone: '+91 76543 21098', email: 'vikram.patel@yahoo.com', city: 'Ahmedabad', campaign: 'Meta Ads Q1 2024', ad: 'Conversion Ad', adSet: 'Gujarat Audience', form: 'Business Enquiry Form', status: 'Follow Up', assignedTo: 'Sneha Joshi', createdAt: '2024-03-13', metaAnswers: [{ q: 'Business Type', a: 'Service Provider' }, { q: 'Monthly Revenue', a: '₹20 Lakh' }, { q: 'Employees', a: '50' }, { q: 'Interested Service', a: 'SEO + Meta Ads' }], notes: [{ id: 1, text: 'Very interested. Needs detailed proposal.', author: 'Sneha Joshi', date: '2024-03-13 16:00' }], activities: [{ id: 1, type: 'Called', desc: 'Called and discussed requirements', date: '2024-03-13 16:00' }], followUp: { date: '2024-03-17', time: '14:00', note: 'Send proposal' } },
  { id: 4, name: 'Neha Gupta', phone: '+91 65432 10987', email: 'neha.gupta@gmail.com', city: 'Pune', campaign: 'Summer Campaign', ad: 'Lead Gen Ad v1', adSet: 'Pune Audience', form: 'Quick Enquiry', status: 'Not Picked', assignedTo: 'Priya Singh', createdAt: '2024-03-12', metaAnswers: [{ q: 'Business Type', a: 'E-commerce' }, { q: 'Monthly Revenue', a: '₹15 Lakh' }], notes: [], activities: [], followUp: null },
  { id: 5, name: 'Suresh Kumar', phone: '+91 54321 09876', email: 'suresh.k@company.com', city: 'Chennai', campaign: 'Meta Ads Q1 2024', ad: 'Brand Awareness', adSet: 'South India', form: 'Business Enquiry Form', status: 'Converted', assignedTo: 'Amit Kumar', createdAt: '2024-03-10', metaAnswers: [{ q: 'Business Type', a: 'IT Services' }, { q: 'Monthly Revenue', a: '₹50 Lakh' }, { q: 'Employees', a: '200' }], notes: [{ id: 1, text: 'Deal closed! ₹2.5L package signed.', author: 'Amit Kumar', date: '2024-03-12 11:00' }], activities: [{ id: 1, type: 'Converted', desc: 'Lead converted to client', date: '2024-03-12 11:00' }], followUp: null },
  { id: 6, name: 'Kavya Reddy', phone: '+91 93456 78901', email: 'kavya.r@gmail.com', city: 'Hyderabad', campaign: 'Diwali Special', ad: 'Festival Ad', adSet: 'Telangana', form: 'Festival Enquiry', status: 'Not Relevant', assignedTo: 'Sneha Joshi', createdAt: '2024-03-11', metaAnswers: [{ q: 'Business Type', a: 'Student' }], notes: [], activities: [], followUp: null },
  { id: 7, name: 'Arjun Singh', phone: '+91 82345 67890', email: 'arjun.singh@gmail.com', city: 'Bangalore', campaign: 'Meta Ads Q1 2024', ad: 'Lead Gen Ad v2', adSet: 'Bangalore Tech', form: 'Business Enquiry Form', status: 'Busy', assignedTo: 'Priya Singh', createdAt: '2024-03-09', metaAnswers: [{ q: 'Business Type', a: 'Startup' }, { q: 'Monthly Revenue', a: '₹8 Lakh' }, { q: 'Employees', a: '15' }], notes: [], activities: [], followUp: { date: '2024-03-20', time: '09:00', note: 'Try again - was busy' } },
  { id: 8, name: 'Divya Nair', phone: '+91 71234 56789', email: 'divya.nair@kerala.com', city: 'Kochi', campaign: 'Summer Campaign', ad: 'Awareness Ad', adSet: 'Kerala Audience', form: 'Contact Form', status: 'Wrong Number', assignedTo: 'Amit Kumar', createdAt: '2024-03-08', metaAnswers: [{ q: 'Business Type', a: 'Unknown' }], notes: [], activities: [], followUp: null },
  { id: 9, name: 'Rajesh Verma', phone: '+91 60123 45678', email: 'rajesh.v@gmail.com', city: 'Jaipur', campaign: 'Meta Ads Q1 2024', ad: 'Conversion Ad', adSet: 'Rajasthan', form: 'Business Enquiry Form', status: 'Switch Off', assignedTo: 'Sneha Joshi', createdAt: '2024-03-07', metaAnswers: [{ q: 'Business Type', a: 'Trading' }, { q: 'Monthly Revenue', a: '₹12 Lakh' }], notes: [], activities: [], followUp: null },
  { id: 10, name: 'Pooja Iyer', phone: '+91 99887 76655', email: 'pooja.iyer@gmail.com', city: 'Coimbatore', campaign: 'Diwali Special', ad: 'Festival Ad', adSet: 'Tamil Nadu', form: 'Festival Enquiry', status: 'New', assignedTo: 'Priya Singh', createdAt: '2024-03-16', metaAnswers: [{ q: 'Business Type', a: 'Beauty Salon' }, { q: 'Monthly Revenue', a: '₹3 Lakh' }, { q: 'Need Website', a: 'Yes' }, { q: 'Interested Service', a: 'Instagram Ads' }], notes: [], activities: [{ id: 1, type: 'Lead Created', desc: 'Lead created from Meta Instant Form', date: '2024-03-16 08:30' }], followUp: null },
]

export const teamMembers = [
  { id: 1, name: 'Priya Singh', email: 'priya.singh@metalead.com', role: 'Agent', avatar: 'PS', phone: '+91 98765 11111', assignedLeads: 15, followUps: 5, converted: 4, joinedAt: '2023-06-15' },
  { id: 2, name: 'Amit Kumar', email: 'amit.kumar@metalead.com', role: 'Manager', avatar: 'AK', phone: '+91 98765 22222', assignedLeads: 22, followUps: 8, converted: 9, joinedAt: '2023-04-10' },
  { id: 3, name: 'Sneha Joshi', email: 'sneha.joshi@metalead.com', role: 'Agent', avatar: 'SJ', phone: '+91 98765 33333', assignedLeads: 18, followUps: 6, converted: 5, joinedAt: '2023-08-20' },
  { id: 4, name: 'Karan Malhotra', email: 'karan.m@metalead.com', role: 'Agent', avatar: 'KM', phone: '+91 98765 44444', assignedLeads: 12, followUps: 3, converted: 3, joinedAt: '2024-01-05' },
]

export const dashboardStats = {
  totalLeads: 247,
  newLeads: 34,
  contacted: 58,
  followUp: 42,
  notPicked: 31,
  notRelevant: 18,
  busy: 22,
  switchOff: 15,
  wrongNumber: 9,
  converted: 18,
}

export const campaigns = [
  { name: 'Meta Ads Q1 2024', leads: 112, converted: 22, spend: '₹45,000', cpl: '₹401' },
  { name: 'Summer Campaign', leads: 78, converted: 11, spend: '₹32,000', cpl: '₹410' },
  { name: 'Diwali Special', leads: 57, converted: 8, spend: '₹28,000', cpl: '₹491' },
]

export const statusColors = {
  'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Contacted': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Follow Up': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Not Picked': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'Not Relevant': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'Busy': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Switch Off': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'Wrong Number': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'Converted': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

export const leadStatuses = ['New', 'Contacted', 'Follow Up', 'Not Picked', 'Not Relevant', 'Busy', 'Switch Off', 'Wrong Number', 'Converted']
