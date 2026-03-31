import MockAdapter from 'axios-mock-adapter';
import api from './api/axiosConfig'; // This imports your existing axios setup

// This creates the interceptor. 
// We add an 800ms delay so you can actually see your beautiful Skeleton Loaders!
const mock = new MockAdapter(api, { delayResponse: 800 });

console.log("🟡 OFFLINE MODE ENGAGED: Mock Backend is intercepting API calls.");

// -----------------------------------------------------------------
// 1. MOCK THE LOGIN
// -----------------------------------------------------------------
mock.onPost('/auth/login').reply(200, {
    username: 'CS123',
    name: 'John Doe',
    role: 'ADMIN', // Change this to 'ADMIN' to test the admin dashboard!
    token: 'fake-jwt-token-12345'
});

// -----------------------------------------------------------------
// 2. MOCK THE "MY TICKETS" PAGE
// -----------------------------------------------------------------
// The Regex /registrations\/user.*/ catches any URL that starts with that path
mock.onGet(/\/registrations\/user.*/).reply(200, [
    {
        id: '65f8a2b1c9d',
        eventTitle: 'Utsav Setu Inauguration Concert',
        status: 'CONFIRMED',
        eventDate: '2026-04-15',
        eventTime: '18:00',
        venue: 'Main Auditorium',
        eventStatus: 'LIVE'
    },
    {
        id: '65f8a2b1c9e',
        eventTitle: 'Hackathon 2026',
        status: 'CANCELLED',
        eventDate: '2026-04-20',
        eventTime: '09:00',
        venue: 'CS Building, Lab 3',
        eventStatus: 'LIVE'
    },
    {
        id: '65f8a2b1c9f',
        eventTitle: 'Guest Lecture: AI & Future',
        status: 'CONFIRMED',
        eventDate: '2026-03-10',
        eventTime: '14:00',
        venue: 'Seminar Hall B',
        eventStatus: 'PAST'
    }
]);

// -----------------------------------------------------------------
// 3. MOCK TICKET CANCELLATION
// -----------------------------------------------------------------
mock.onPut(/\/registrations\/.*\/cancel/).reply(200, {
    message: "Registration cancelled successfully."
});

// If an API call doesn't match the above, let it pass through normally
mock.onAny().passThrough();

// -----------------------------------------------------------------
// 4. MOCK THE ADMIN DASHBOARD (SUPER_ADMIN & CLUB_ADMIN)
// -----------------------------------------------------------------

// Mocking the top-level statistics (Cards at the top of the dashboard)
mock.onGet('/admin/stats').reply((config) => {
    // In a real app, you'd check the token here to see if they are a SUPER or CLUB admin.
    // For the mock, we will just return a massive, successful platform dataset!
    return [200, {
        totalEvents: 14,
        activeEvents: 5,
        totalRegistrations: 1240,
        totalRevenue: 0, // Assuming college events are mostly free!
        growthPercentage: "+15%", // Compared to last month
    }];
});

// Mocking the Live Event Capacities Table
mock.onGet('/admin/events/capacities').reply(200, [
    {
        id: 'evt_001',
        title: 'Utsav Setu Inauguration Concert',
        organizer: 'Cultural Club',
        date: '2026-04-15',
        capacity: 500,
        registered: 480,
        status: 'LIVE',
        trend: 'HIGH_DEMAND'
    },
    {
        id: 'evt_002',
        title: 'Hackathon 2026',
        organizer: 'CS Department',
        date: '2026-04-20',
        capacity: 200,
        registered: 150,
        status: 'LIVE',
        trend: 'STEADY'
    },
    {
        id: 'evt_003',
        title: 'Robotics Workshop',
        organizer: 'Robotics Club',
        date: '2026-04-22',
        capacity: 50,
        registered: 50,
        status: 'SOLD_OUT',
        trend: 'FULL'
    }
]);

// Mocking the CSV Export Endpoint
// When the admin clicks "Export", it hits this URL to get the raw data
mock.onGet(/\/admin\/events\/.*\/export/).reply(200, [
    { rollNumber: 'CS101', name: 'Alice Smith', email: 'alice@college.edu', branch: 'CSE', year: 3 },
    { rollNumber: 'CS123', name: 'John Doe', email: 'john@college.edu', branch: 'CSE', year: 3 },
    { rollNumber: 'ME405', name: 'Bob Johnson', email: 'bob@college.edu', branch: 'ME', year: 2 },
]);