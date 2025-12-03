import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon,Bell,Calendar1,MapPin,ExternalLink, BellOff } from 'lucide-react';
import { timelineAPI } from '../../services/api';
import { toast } from 'sonner';

const ModernTimelineTracker = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedEvents, setSubscribedEvents] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);

  const calendarRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    fetchSubscriptions();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await timelineAPI.getEvents();
      setEvents(response.data.data || response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback mock data
      setEvents([
        {
          _id: '1',
          title: 'College Admission Applications Open',
          description: 'Start of admission process for government colleges.',
          date: new Date('2024-03-01'),
          type: 'admission',
          category: 'Important',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/admissions',
        },
        {
          _id: '2',
          title: 'Scholarship Applications Deadline',
          description: 'Last date to apply for merit-based scholarships.',
          date: new Date('2024-04-15'),
          type: 'scholarship',
          category: 'Deadline',
          location: 'Various',
          isActive: true,
          link: 'https://example.com/scholarships',
        },
        {
          _id: '3',
          title: 'Spring Semester Registration',
          description: 'Students must complete course registration for Spring 2024 semester.',
          date: new Date('2024-02-20'),
          type: 'exam',
          category: 'Important',
          location: 'Campus Portal',
          isActive: true,
          link: 'https://example.com/registration',
        },
        {
          _id: '4',
          title: 'National Science Conference',
          description: 'Annual conference for research students and faculty.',
          date: new Date('2024-05-10'),
          type: 'event',
          category: 'Event',
          location: 'Bangalore',
          isActive: true,
          link: 'https://example.com/conference',
        },
        {
          _id: '5',
          title: 'Alumni Meet 2024',
          description: 'Reconnect with alumni and network with industry experts.',
          date: new Date('2024-06-15'),
          type: 'event',
          category: 'Event',
          location: 'IIT Delhi Campus',
          isActive: true,
          link: 'https://example.com/alumni',
        },
        {
          _id: '6',
          title: 'Symbiosis International University Entrance Exam',
          description: 'Reminder: Entrance exam scheduled for Symbiosis University.',
          date: new Date('2024-08-10T09:00:00'),
          type: 'exam',
          category: 'Exam',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/symbiosis-exam',
        },
        {
          _id: '7',
          title: 'MIT Manipal Scholarship Announcement',
          description: 'Merit-based scholarship results will be announced soon.',
          date: new Date('2024-08-15T12:00:00'),
          type: 'scholarship',
          category: 'Announcement',
          location: 'Manipal',
          isActive: true,
          link: 'https://example.com/mit-scholarship',
        },
        {
          _id: '8',
          title: 'IISc Bangalore Research Internship Opening',
          description: 'Applications open for summer research internships.',
          date: new Date('2024-09-01T10:30:00'),
          type: 'admission',
          category: 'Opportunity',
          location: 'Bangalore',
          isActive: true,
          link: 'https://example.com/iisc-internship',
        },
        {
          _id: '9',
          title: 'DU Arts Faculty Seminar',
          description: 'Webinar for guidance on new arts programs and scholarships.',
          date: new Date('2024-09-20T15:00:00'),
          type: 'event',
          category: 'Seminar',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/du-seminar',
        },
        {
          _id: '10',
          title: 'VIT Vellore Placement Drive',
          description: 'Reminder: Campus placement drive starts next week.',
          date: new Date('2024-10-05T09:00:00'),
          type: 'event',
          category: 'Placement',
          location: 'Vellore',
          isActive: true,
          link: 'https://example.com/vit-placement',
        },
        // Additional 6-7 cards
        {
          _id: '11',
          title: 'JEE Main 2025 Registration Opens',
          description: 'Registration for JEE Main 2025 now open - prepare your documents.',
          date: new Date('2024-11-01T10:00:00'),
          type: 'exam',
          category: 'Registration',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/jee-main-reg',
        },
        {
          _id: '12',
          title: 'NEET UG 2025 Mock Test Series',
          description: 'Free mock test series for NEET UG 2025 preparation.',
          date: new Date('2024-11-15T14:00:00'),
          type: 'exam',
          category: 'Preparation',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/neet-mock-tests',
        },
        {
          _id: '13',
          title: 'KVPY Scholarship Exam Date Announced',
          description: 'KVPY 2025 exam date and registration details released.',
          date: new Date('2024-12-01T11:00:00'),
          type: 'scholarship',
          category: 'Announcement',
          location: 'Various',
          isActive: true,
          link: 'https://example.com/kvpy-2025',
        },
        {
          _id: '14',
          title: 'IIT Bombay Open House',
          description: 'Virtual open house for prospective students and parents.',
          date: new Date('2024-12-10T16:00:00'),
          type: 'event',
          category: 'Open House',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/iitb-open-house',
        },
        {
          _id: '15',
          title: 'CUET UG 2025 Syllabus Update',
          description: 'Updated syllabus for CUET UG 2025 released - check changes.',
          date: new Date('2024-12-20T09:30:00'),
          type: 'exam',
          category: 'Update',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/cuet-syllabus',
        },
        {
          _id: '16',
          title: 'INSPIRE Scholarship Results',
          description: 'Results for INSPIRE scholarship 2024 announced.',
          date: new Date('2025-01-05T12:00:00'),
          type: 'scholarship',
          category: 'Results',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/inspire-results',
        },
        {
          _id: '17',
          title: 'BITSAT 2025 Registration',
          description: 'BITSAT 2025 registration portal opens for session 1.',
          date: new Date('2025-01-15T10:00:00'),
          type: 'admission',
          category: 'Registration',
          location: 'Online',
          isActive: true,
          link: 'https://example.com/bitsat-reg',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

const addToGoogleCalendar = (event) => {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.location || "");

  const start = new Date(event.date)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";

  const endDate = new Date(event.date);
  endDate.setHours(endDate.getHours() + 1);

  const end = endDate
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";

  const url = `
    https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=${title}
    &details=${details}
    &location=${location}
    &dates=${start}/${end}
  `.replace(/\s+/g, "");

  window.open(url, "_blank");
};


  const fetchSubscriptions = async () => {
    try {
      const response = await timelineAPI.getMySubscriptions();
      const subscribed = new Set(response.data.data?.map(sub => sub.eventId) || []);
      setSubscribedEvents(subscribed);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

function CalendarConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800">
          Add to Google Calendar?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          You’ve subscribed to this event.  
          Do you also want to add it to your Google Calendar?
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={onClose}
          >
            No
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

  
  const handleSubscribe = async (eventId) => {
    try {
      if (subscribedEvents.has(eventId)) {
        await timelineAPI.unsubscribe(eventId);
        setSubscribedEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        toast.success('Unsubscribed from event notifications');
      } else {
        await timelineAPI.subscribe(eventId);
        setSubscribedEvents(prev => new Set([...prev, eventId]));
        toast.success('Subscribed to event notifications');
      }
    } catch {
      toast.error('Failed to update subscription');
    }
  };

  const handleDualSubscribe = async (eventId, event) => {
  await handleSubscribe(eventId); // your existing logic

  setSelectedEvent(event);    // store event details
  setShowCalendarModal(true); // open popup
};

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      admission: 'bg-blue-100 text-blue-800',
      scholarship: 'bg-green-100 text-green-800',
      exam: 'bg-orange-100 text-orange-800',
      event: 'bg-purple-100 text-purple-800',
      deadline: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const searchFilteredEvents = filteredEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery) ||
    event.description.toLowerCase().includes(searchQuery) ||
    event.category?.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg flex-1"></div>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Timeline Tracker</h1>
          <p className="text-gray-600 text-lg">Stay updated with important dates and deadlines</p>
        </div>

        {/* Filters + Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
              className="rounded-full px-4 py-2"
            >
              All Events
            </Button>
            <Button
              variant={filter === 'subscribed' ? 'default' : 'outline'}
              onClick={() => setFilter('subscribed')}
              size="sm"
              className="rounded-full px-4 py-2"
            >
              Subscribed
            </Button>
            <Button
              variant={filter === 'admission' ? 'default' : 'outline'}
              onClick={() => setFilter('admission')}
              size="sm"
              className="rounded-full px-4 py-2"
            >
              Admissions
            </Button>
            <Button
              variant={filter === 'scholarship' ? 'default' : 'outline'}
              onClick={() => setFilter('scholarship')}
              size="sm"
              className="rounded-full px-4 py-2"
            >
              Scholarships
            </Button>
            <Button
              variant={filter === 'exam' ? 'default' : 'outline'}
              onClick={() => setFilter('exam')}
              size="sm"
              className="rounded-full px-4 py-2"
            >
              Exams
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
<CalendarConfirmModal
  open={showCalendarModal}
  onClose={() => setShowCalendarModal(false)}
  onConfirm={() => {
    addToGoogleCalendar(selectedEvent);
    setShowCalendarModal(false);
  }}
/>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchFilteredEvents.map((event) => (
            <Card key={event._id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 shadow-md bg-white/80 backdrop-blur-sm flex flex-col">
              <CardHeader className="pb-4 p-6 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${getEventTypeColor(event.type)} rounded-full px-3 py-1 text-xs font-medium`}>{event.type}</Badge>
                  <Button
  variant="ghost"
  size="sm"
  onClick={() => handleDualSubscribe(event._id, event)}
  className="ml-4 -mt-1"
>
  {subscribedEvents.has(event._id) ? (
    <BellOff className="h-4 w-4" />
  ) : (
    <Bell className="h-4 w-4 text-blue-600" />
  )}
</Button>

                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">{event.title}</CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{event.description}</p>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                {/* Info Bar */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 min-w-fit">
                      <Calendar1 className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 min-w-fit">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                {event.category && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs rounded-full border-gray-200 text-gray-600 hover:bg-gray-100">
                      {event.category}
                    </Badge>
                  </div>
                )}
                {/* Button - Always at bottom */}
                <div className="mt-auto pt-4">
                  <div className="flex gap-3">
                    <Button asChild size="sm" className="flex-1 rounded-xl">
                      {event.link ? (
                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Learn More
                        </a>
                      ) : (
                        <span>Details</span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchFilteredEvents.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <Calendar1 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchQuery ? `No events match "${searchQuery}".` : 
               filter === 'all' ? 'No events are currently available.' : 
               `No events found for the selected filter: ${filter}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTimelineTracker;