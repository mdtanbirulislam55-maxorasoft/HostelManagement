import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "Hostel Management System": "Hostel Management System",
      "Admin User": "Admin User",
      "System Administrator": "System Administrator",
      
      // Navigation
      "Dashboard": "Dashboard",
      "Student Management": "Student Management",
      "Room Management": "Room Management",
      "Floor Management": "Floor Management",
      "Payment Tracking": "Payment Tracking",
      "Financial Reports": "Financial Reports",
      "Alerts & Notifications": "Alerts & Notifications",
      "Activity Logs": "Activity Logs",
      "Settings": "Settings",
      "Logout": "Logout",
      
      // Dashboard
      "Dashboard Overview": "Dashboard Overview",
      "Monitor and manage your hostel operations": "Monitor and manage your hostel operations",
      "Add New Student": "Add New Student",
      
      // Metrics
      "Total Students": "Total Students",
      "+12 this month": "+12 this month",
      "Total Rooms": "Total Rooms",
      "Across 6 floors": "Across 6 floors",
      "Available Beds": "Available Beds",
      "-5 this week": "-5 this week",
      "Monthly Revenue": "Monthly Revenue",
      "+8.2% vs last month": "+8.2% vs last month",
      
      // Floor Management
      "Floor Management - Room Status": "Floor Management - Room Status",
      "Occupied": "Occupied",
      "Vacant": "Vacant",
      "Maintenance": "Maintenance",
      "Floor 1": "Floor 1",
      "Floor 2": "Floor 2",
      "Floor 3": "Floor 3",
      "Floor 4": "Floor 4",
      "Floor 5": "Floor 5",
      "Floor 6": "Floor 6",
      
      // Alerts
      "Recent Alerts": "Recent Alerts",
      "Overdue Payment Alert": "Overdue Payment Alert",
      "3 students have pending payments for over 15 days": "3 students have pending payments for over 15 days",
      "Maintenance Required": "Maintenance Required",
      "Room 408 AC unit needs repair": "Room 408 AC unit needs repair",
      "High Occupancy Notice": "High Occupancy Notice",
      "Floor 3 is at 95% capacity": "Floor 3 is at 95% capacity",
      
      // Quick Actions
      "Quick Actions": "Quick Actions",
      "Generate Monthly Report": "Generate Monthly Report",
      "Send Payment Reminders": "Send Payment Reminders",
      "Export Student Data": "Export Student Data",
      
      // Student Table
      "Recent Student Activities": "Recent Student Activities",
      "Search students...": "Search students...",
      "Filter": "Filter",
      "Student ID": "Student ID",
      "Name": "Name",
      "Room": "Room",
      "Payment Status": "Payment Status",
      "Last Payment": "Last Payment",
      "Actions": "Actions",
      "Paid": "Paid",
      "Pending": "Pending",
      "Overdue": "Overdue",
      "Showing 1 to 5 of 247 results": "Showing 1 to 5 of 247 results",
      "Previous": "Previous",
      "Next": "Next",
      
      // Common
      "Login": "Login",
      "Welcome": "Welcome",
      "Loading...": "Loading...",
      "Error": "Error",
      "Success": "Success",
      "Save": "Save",
      "Cancel": "Cancel",
      "Delete": "Delete",
      "Edit": "Edit",
      "View": "View",
      "Close": "Close",
      
      // Auth
      "Please log in to access the hostel management system": "Please log in to access the hostel management system",
      "Unauthorized": "Unauthorized",
      "You are logged out. Logging in again...": "You are logged out. Logging in again...",
    }
  },
  bn: {
    translation: {
      // Header
      "Hostel Management System": "হোস্টেল ব্যবস্থাপনা সিস্টেম",
      "Admin User": "অ্যাডমিন ব্যবহারকারী",
      "System Administrator": "সিস্টেম প্রশাসক",
      
      // Navigation
      "Dashboard": "ড্যাশবোর্ড",
      "Student Management": "ছাত্র ব্যবস্থাপনা",
      "Room Management": "রুম ব্যবস্থাপনা",
      "Floor Management": "ফ্লোর ব্যবস্থাপনা",
      "Payment Tracking": "পেমেন্ট ট্র্যাকিং",
      "Financial Reports": "আর্থিক প্রতিবেদন",
      "Alerts & Notifications": "সতর্কতা ও বিজ্ঞপ্তি",
      "Activity Logs": "কার্যকলাপ লগ",
      "Settings": "সেটিংস",
      "Logout": "লগ আউট",
      
      // Dashboard
      "Dashboard Overview": "ড্যাশবোর্ড ওভারভিউ",
      "Monitor and manage your hostel operations": "আপনার হোস্টেল অপারেশন মনিটর এবং পরিচালনা করুন",
      "Add New Student": "নতুন ছাত্র যোগ করুন",
      
      // Metrics
      "Total Students": "মোট ছাত্র",
      "+12 this month": "+১২ এই মাসে",
      "Total Rooms": "মোট রুম",
      "Across 6 floors": "৬টি ফ্লোর জুড়ে",
      "Available Beds": "উপলব্ধ বেড",
      "-5 this week": "-৫ এই সপ্তাহে",
      "Monthly Revenue": "মাসিক আয়",
      "+8.2% vs last month": "+৮.২% বিগত মাসের তুলনায়",
      
      // Floor Management
      "Floor Management - Room Status": "ফ্লোর ব্যবস্থাপনা - রুমের অবস্থা",
      "Occupied": "দখলকৃত",
      "Vacant": "খালি",
      "Maintenance": "রক্ষণাবেক্ষণ",
      "Floor 1": "ফ্লোর ১",
      "Floor 2": "ফ্লোর ২",
      "Floor 3": "ফ্লোর ৩",
      "Floor 4": "ফ্লোর ৪",
      "Floor 5": "ফ্লোর ৫",
      "Floor 6": "ফ্লোর ৬",
      
      // Alerts
      "Recent Alerts": "সাম্প্রতিক সতর্কতা",
      "Overdue Payment Alert": "বিলম্বিত পেমেন্ট সতর্কতা",
      "3 students have pending payments for over 15 days": "৩ জন ছাত্রের ১৫ দিনের বেশি পেমেন্ট বকেয়া রয়েছে",
      "Maintenance Required": "রক্ষণাবেক্ষণ প্রয়োজন",
      "Room 408 AC unit needs repair": "রুম ৪০৮ এর এসি ইউনিট মেরামত প্রয়োজন",
      "High Occupancy Notice": "উচ্চ দখল নোটিশ",
      "Floor 3 is at 95% capacity": "ফ্লোর ৩ ৯৫% ক্ষমতায় রয়েছে",
      
      // Quick Actions
      "Quick Actions": "দ্রুত কার্যক্রম",
      "Generate Monthly Report": "মাসিক প্রতিবেদন তৈরি করুন",
      "Send Payment Reminders": "পেমেন্ট অনুস্মারক পাঠান",
      "Export Student Data": "ছাত্র ডেটা রপ্তানি করুন",
      
      // Student Table
      "Recent Student Activities": "সাম্প্রতিক ছাত্র কার্যক্রম",
      "Search students...": "ছাত্র খুঁজুন...",
      "Filter": "ফিল্টার",
      "Student ID": "ছাত্র আইডি",
      "Name": "নাম",
      "Room": "রুম",
      "Payment Status": "পেমেন্ট অবস্থা",
      "Last Payment": "শেষ পেমেন্ট",
      "Actions": "কার্যক্রম",
      "Paid": "পরিশোধিত",
      "Pending": "অপেক্ষমাণ",
      "Overdue": "বিলম্বিত",
      "Showing 1 to 5 of 247 results": "২৪৭টির মধ্যে ১ থেকে ৫ দেখানো হচ্ছে",
      "Previous": "পূর্ববর্তী",
      "Next": "পরবর্তী",
      
      // Common
      "Login": "লগইন",
      "Welcome": "স্বাগতম",
      "Loading...": "লোড হচ্ছে...",
      "Error": "ত্রুটি",
      "Success": "সফল",
      "Save": "সংরক্ষণ",
      "Cancel": "বাতিল",
      "Delete": "মুছুন",
      "Edit": "সম্পাদনা",
      "View": "দেখুন",
      "Close": "বন্ধ",
      
      // Auth
      "Please log in to access the hostel management system": "হোস্টেল ব্যবস্থাপনা সিস্টেমে অ্যাক্সেস করতে লগইন করুন",
      "Unauthorized": "অনুমোদিত নয়",
      "You are logged out. Logging in again...": "আপনি লগ আউট হয়েছেন। আবার লগইন করছেন...",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
