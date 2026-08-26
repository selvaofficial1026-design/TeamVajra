import { 
  syncStudentToCloud, 
  deleteStudentFromCloud, 
  syncMeetLinkToCloud, 
  syncVideoToCloud, 
  deleteVideoFromCloud,
  syncMessageToCloud,
  replyMessageInCloud,
  deleteMessageFromCloud
} from "./firebase";

export interface VajraStudent {
  accessCode: string;
  requestCode?: string;
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  name: string;
  phone: string;
  course: string;
  ageGroup: string;
  batchTime: string;
  joinedDate: string;
  attendanceRate: number;
  attendedClasses: number;
  totalClasses: number;
  streakDays: number;
  nextAssessment: string;
  feeStatus: 'ACTIVE' | 'DUE';
  feeRenewalDate: string;
  completedDrills: string[];
}

export interface TrainingVideo {
  id: string;
  course: string;
  title: string;
  youtubeUrl: string;
  thumbnail?: string;
  duration: string;
  level: string;
  desc: string;
  focusPoints: string[];
}

export interface MeetInfo {
  url: string;
  updatedAt: number | null;
  timeAgoText: string;
  isRecent: boolean;
}

export interface VajraMessage {
  id: string;
  studentCode: string;
  studentName: string;
  studentPhone: string;
  course: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  timestamp: number;
  status: 'UNREAD' | 'READ' | 'REPLIED';
}

const ACTIVE_STUDENT_KEY = 'vajra_active_student';
const MEMBERS_REGISTRY_KEY = 'vajra_members_registry';
const COURSE_MEET_LINKS_KEY = 'vajra_course_meet_links';
const COURSE_MEET_TIMESTAMPS_KEY = 'vajra_course_meet_timestamps';
const TRAINING_VIDEOS_KEY = 'vajra_training_videos_real';
const MESSAGES_KEY = 'vajra_inapp_messages';

export class VajraStudentStore {
  static getMembersRegistry(): Record<string, VajraStudent> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(MEMBERS_REGISTRY_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static saveMemberToRegistry(student: VajraStudent) {
    if (typeof window === 'undefined') return;
    try {
      const registry = this.getMembersRegistry();
      registry[student.accessCode.toUpperCase()] = student;
      // If student has a separate requestCode, index it too
      if (student.requestCode) {
        registry[student.requestCode.toUpperCase()] = student;
      }
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      
      // Auto Sync to Cloud Firestore
      syncStudentToCloud(student);
    } catch (e) {
      console.error(e);
    }
  }

  static syncMembersFromCloud(cloudStudents: VajraStudent[]) {
    if (typeof window === 'undefined' || !cloudStudents) return;
    try {
      const registry = this.getMembersRegistry();
      cloudStudents.forEach(st => {
        if (st && st.accessCode) {
          registry[st.accessCode.toUpperCase()] = st;
          if (st.requestCode) {
            registry[st.requestCode.toUpperCase()] = st;
          }
        }
      });
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      window.dispatchEvent(new Event('vajra_registry_change'));
    } catch (e) {
      console.error(e);
    }
  }

  static normalizePhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/[^0-9]/g, '');
    return digits.length > 10 ? digits.slice(-10) : digits;
  }

  static getStudentByPhone(phone: string): VajraStudent | null {
    const norm = this.normalizePhone(phone);
    if (!norm || norm.length < 10) return null;
    const all = this.getAllStudents();
    return all.find(s => this.normalizePhone(s.phone) === norm) || null;
  }

  static getMemberFromRegistry(code: string): VajraStudent | null {
    const registry = this.getMembersRegistry();
    const clean = code.toUpperCase().trim();
    if (registry[clean]) return registry[clean];
    
    // Fallback search across all members
    const all = Object.values(registry);
    return all.find(s => 
      s.accessCode.toUpperCase().trim() === clean || 
      (s.requestCode && s.requestCode.toUpperCase().trim() === clean)
    ) || null;
  }

  static getStudent(): VajraStudent | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (!data) return null;
    try {
      const student: VajraStudent = JSON.parse(data);
      // Strictly verify student is APPROVED and exists in registry
      if (!student || student.approvalStatus !== 'APPROVED') {
        localStorage.removeItem(ACTIVE_STUDENT_KEY);
        return null;
      }
      return student;
    } catch {
      return null;
    }
  }

  static setStudent(student: VajraStudent | null) {
    if (typeof window === 'undefined') return;
    if (student && student.approvalStatus === 'APPROVED') {
      localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(student));
      this.saveMemberToRegistry(student);
    } else {
      localStorage.removeItem(ACTIVE_STUDENT_KEY);
    }
    window.dispatchEvent(new Event('vajra_student_change'));
  }

  /* =========================================================================
      ADMISSION WORKFLOW: PENDING REGISTRATION WITH TRACKING CODE
     ========================================================================= */
  static createPendingAdmission(
    name: string, 
    phone: string, 
    course: string, 
    ageGroup: string, 
    batchTime: string
  ): { student: VajraStudent; requestCode: string } {
    const selectedCourse = course || 'MARTIAL ARTS';
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const renewalDate = `1st of ${nextMonth.toLocaleDateString('en-US', { month: 'short' })}`;

    const requestCode = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const pendingStudent: VajraStudent = {
      accessCode: requestCode, // Initial tracking code
      requestCode: requestCode,
      approvalStatus: 'PENDING_APPROVAL',
      name: name.trim() || "Applicant",
      phone: phone.trim() || "+91 86681 02797",
      course: selectedCourse,
      ageGroup: ageGroup || 'Adult (18–45 yrs)',
      batchTime: batchTime || 'Morning (05:30 AM – 07:30 AM)',
      joinedDate: today,
      attendanceRate: 100,
      attendedClasses: 1,
      totalClasses: 1,
      streakDays: 1,
      nextAssessment: `15th of ${nextMonth.toLocaleDateString('en-US', { month: 'short' })}`,
      feeStatus: 'ACTIVE',
      feeRenewalDate: renewalDate,
      completedDrills: []
    };

    this.saveMemberToRegistry(pendingStudent);
    return { student: pendingStudent, requestCode };
  }

  static createStudentProfile(
    code: string, 
    name: string, 
    phone: string, 
    course: string, 
    ageGroup: string, 
    batchTime: string
  ): VajraStudent {
    const selectedCourse = course || 'MARTIAL ARTS';
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const renewalDate = `1st of ${nextMonth.toLocaleDateString('en-US', { month: 'short' })}`;

    const newStudent: VajraStudent = {
      accessCode: code.toUpperCase().trim(),
      approvalStatus: 'APPROVED',
      name: name.trim() || "Member",
      phone: phone.trim() || "+91 86681 02797",
      course: selectedCourse,
      ageGroup: ageGroup || 'Adult (18–45 yrs)',
      batchTime: batchTime || 'Morning (05:30 AM – 07:30 AM)',
      joinedDate: today,
      attendanceRate: 100,
      attendedClasses: 1,
      totalClasses: 1,
      streakDays: 1,
      nextAssessment: `15th of ${nextMonth.toLocaleDateString('en-US', { month: 'short' })}`,
      feeStatus: 'ACTIVE',
      feeRenewalDate: renewalDate,
      completedDrills: []
    };

    this.saveMemberToRegistry(newStudent);
    return newStudent;
  }

  static approveAdmission(codeOrRequest: string): VajraStudent | null {
    const registry = this.getMembersRegistry();
    const clean = codeOrRequest.toUpperCase().trim();
    const student = this.getMemberFromRegistry(clean);
    if (!student) return null;

    // Generate permanent VIP Student Access Code
    const permanentCode = `VAJRA-${Math.floor(1000 + Math.random() * 9000)}`;
    const oldRequestCode = student.requestCode || student.accessCode;

    student.accessCode = permanentCode;
    student.requestCode = oldRequestCode; // keep as alias so tracking returns the approved code!
    student.approvalStatus = 'APPROVED';

    registry[permanentCode] = student;
    registry[oldRequestCode] = student;
    
    try {
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      
      const active = this.getStudent();
      if (active && (active.accessCode === oldRequestCode || active.requestCode === oldRequestCode)) {
        localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(student));
        window.dispatchEvent(new Event('vajra_student_change'));
      }

      // Auto Sync to Cloud
      syncStudentToCloud(student);
      window.dispatchEvent(new Event('vajra_registry_change'));
    } catch (e) {
      console.error(e);
    }

    return student;
  }

  static rejectAdmission(codeOrRequest: string): boolean {
    const registry = this.getMembersRegistry();
    const clean = codeOrRequest.toUpperCase().trim();
    const student = this.getMemberFromRegistry(clean);
    if (!student) return false;

    student.approvalStatus = 'REJECTED';
    registry[student.accessCode.toUpperCase()] = student;
    if (student.requestCode) {
      registry[student.requestCode.toUpperCase()] = student;
    }

    try {
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      syncStudentToCloud(student);
      window.dispatchEvent(new Event('vajra_registry_change'));
    } catch (e) {
      console.error(e);
    }
    return true;
  }

  static getAllStudents(): VajraStudent[] {
    const registry = this.getMembersRegistry();
    const map = new Map<string, VajraStudent>();
    Object.values(registry).forEach(st => {
      // Group by phone or primary access code to avoid duplicate alias entries
      const key = st.phone || st.accessCode;
      if (!map.has(key) || st.approvalStatus === 'APPROVED') {
        map.set(key, st);
      }
    });
    return Array.from(map.values());
  }

  static updateStudent(code: string, updates: Partial<VajraStudent>): VajraStudent | null {
    if (typeof window === 'undefined') return null;
    const registry = this.getMembersRegistry();
    const upperCode = code.toUpperCase().trim();
    const student = this.getMemberFromRegistry(upperCode);
    if (!student) return null;

    const updated = { ...student, ...updates };
    registry[updated.accessCode.toUpperCase()] = updated;
    if (updated.requestCode) {
      registry[updated.requestCode.toUpperCase()] = updated;
    }

    try {
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      
      const active = this.getStudent();
      if (active && (active.accessCode.toUpperCase() === upperCode || active.requestCode?.toUpperCase() === upperCode)) {
        localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('vajra_student_change'));
      }

      // Auto Sync to Cloud
      syncStudentToCloud(updated);
    } catch (e) {
      console.error(e);
    }
    return updated;
  }

  static deleteStudent(code: string): boolean {
    if (typeof window === 'undefined') return false;
    const registry = this.getMembersRegistry();
    const upperCode = code.toUpperCase().trim();
    const student = this.getMemberFromRegistry(upperCode);
    if (!student) return false;

    delete registry[student.accessCode.toUpperCase()];
    if (student.requestCode) {
      delete registry[student.requestCode.toUpperCase()];
    }

    try {
      localStorage.setItem(MEMBERS_REGISTRY_KEY, JSON.stringify(registry));
      const active = this.getStudent();
      if (active && (active.accessCode.toUpperCase() === upperCode || active.requestCode?.toUpperCase() === upperCode)) {
        localStorage.removeItem(ACTIVE_STUDENT_KEY);
        window.dispatchEvent(new Event('vajra_student_change'));
      }

      // Auto Delete from Cloud
      deleteStudentFromCloud(student.accessCode.toUpperCase());
    } catch (e) {
      console.error(e);
    }
    return true;
  }

  static isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('vajra_admin_auth') === 'true';
    } catch {
      return false;
    }
  }

  static setAdminAuthenticated(auth: boolean) {
    if (typeof window === 'undefined') return;
    try {
      if (auth) {
        sessionStorage.setItem('vajra_admin_auth', 'true');
      } else {
        sessionStorage.removeItem('vajra_admin_auth');
      }
    } catch (e) {
      console.error(e);
    }
  }

  /* =========================================================================
      REAL COURSE-SPECIFIC GOOGLE MEET LINKS & REAL-TIME TIMESTAMPS
     ========================================================================= */
  static getAllMeetLinks(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(COURSE_MEET_LINKS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static getAllMeetTimestamps(): Record<string, number> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(COURSE_MEET_TIMESTAMPS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static getMeetLinkInfo(course?: string): MeetInfo {
    const links = this.getAllMeetLinks();
    const upper = course ? course.toUpperCase().trim() : 'GENERAL';
    const url = links[upper] || links['GENERAL'] || links['SILAMBAM'] || 'https://meet.google.com/new';
    
    const timestamps = this.getAllMeetTimestamps();
    const updatedAt = timestamps[upper] || timestamps['GENERAL'] || null;

    let timeAgoText = "Active Session Link";
    let isRecent = false;

    if (updatedAt) {
      const diffMs = Date.now() - updatedAt;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMins < 1) {
        timeAgoText = "Coach posted this link just now";
        isRecent = true;
      } else if (diffMins < 60) {
        timeAgoText = `Coach posted this link ${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        isRecent = true;
      } else if (diffHours < 24) {
        timeAgoText = `Coach posted this link ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        isRecent = true;
      } else {
        const dateStr = new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        timeAgoText = `Updated on ${dateStr}`;
      }
    }

    return { url, updatedAt, timeAgoText, isRecent };
  }

  static getLiveMeetLink(course?: string): string {
    return this.getMeetLinkInfo(course).url;
  }

  static setLiveMeetLink(course: string, link: string) {
    if (typeof window === 'undefined') return;
    try {
      const upper = course.toUpperCase().trim();
      const links = this.getAllMeetLinks();
      links[upper] = link;
      localStorage.setItem(COURSE_MEET_LINKS_KEY, JSON.stringify(links));

      const now = Date.now();
      const timestamps = this.getAllMeetTimestamps();
      timestamps[upper] = now;
      localStorage.setItem(COURSE_MEET_TIMESTAMPS_KEY, JSON.stringify(timestamps));

      // Auto Sync to Cloud
      syncMeetLinkToCloud(upper, link, now);

      window.dispatchEvent(new Event('vajra_meet_link_updated'));
    } catch (e) {
      console.error(e);
    }
  }

  static syncMeetLinksFromCloud(cloudLinks: Record<string, { url: string; updatedAt: number }>) {
    if (typeof window === 'undefined' || !cloudLinks) return;
    try {
      const links = this.getAllMeetLinks();
      const timestamps = this.getAllMeetTimestamps();
      
      Object.keys(cloudLinks).forEach(course => {
        const item = cloudLinks[course];
        if (item && item.url) {
          links[course] = item.url;
          timestamps[course] = item.updatedAt || Date.now();
        }
      });

      localStorage.setItem(COURSE_MEET_LINKS_KEY, JSON.stringify(links));
      localStorage.setItem(COURSE_MEET_TIMESTAMPS_KEY, JSON.stringify(timestamps));
      window.dispatchEvent(new Event('vajra_meet_link_updated'));
    } catch (e) {
      console.error(e);
    }
  }

  /* =========================================================================
      REAL TRAINING MASTERCLASS YOUTUBE VIDEOS (NO MOCK DATA)
     ========================================================================= */
  static getStoredVideos(): Record<string, TrainingVideo[]> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(TRAINING_VIDEOS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static getCourseVideos(course?: string): TrainingVideo[] {
    const stored = this.getStoredVideos();
    if (!course) return Object.values(stored).flat();
    const upper = course.toUpperCase().trim();
    return stored[upper] || [];
  }

  static getAllVideos(): TrainingVideo[] {
    const stored = this.getStoredVideos();
    return Object.values(stored).flat();
  }

  static addCourseVideo(video: Omit<TrainingVideo, 'id'>): TrainingVideo {
    const stored = this.getStoredVideos();
    const upper = video.course.toUpperCase().trim();
    if (!stored[upper]) stored[upper] = [];

    const newVideo: TrainingVideo = {
      ...video,
      id: `${upper.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    };

    stored[upper].unshift(newVideo);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TRAINING_VIDEOS_KEY, JSON.stringify(stored));
        // Auto Sync to Cloud
        syncVideoToCloud(newVideo);
      } catch (e) {
        console.error(e);
      }
    }
    return newVideo;
  }

  static deleteCourseVideo(course: string, id: string): boolean {
    const stored = this.getStoredVideos();
    const upper = course.toUpperCase().trim();
    if (!stored[upper]) return false;

    stored[upper] = stored[upper].filter(v => v.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TRAINING_VIDEOS_KEY, JSON.stringify(stored));
        // Auto Delete from Cloud
        deleteVideoFromCloud(id);
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  static syncVideosFromCloud(cloudVideos: TrainingVideo[]) {
    if (typeof window === 'undefined' || !cloudVideos) return;
    try {
      const stored: Record<string, TrainingVideo[]> = {};
      cloudVideos.forEach(v => {
        if (v && v.course) {
          const upper = v.course.toUpperCase().trim();
          if (!stored[upper]) stored[upper] = [];
          stored[upper].push(v);
        }
      });
      localStorage.setItem(TRAINING_VIDEOS_KEY, JSON.stringify(stored));
      window.dispatchEvent(new Event('vajra_videos_updated'));
    } catch (e) {
      console.error(e);
    }
  }

  /* =========================================================================
      IN-APP REAL-TIME STUDENT-ADMIN MESSAGES & DOUBT DESK (NO WHATSAPP NEEDED)
     ========================================================================= */
  static getAllMessages(): VajraMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MESSAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getStudentMessages(studentCode: string): VajraMessage[] {
    const all = this.getAllMessages();
    const upper = studentCode.toUpperCase().trim();
    return all.filter(m => m.studentCode.toUpperCase().trim() === upper);
  }

  static sendStudentMessage(student: VajraStudent, messageText: string): VajraMessage {
    const all = this.getAllMessages();
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newMsg: VajraMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentCode: student.accessCode.toUpperCase(),
      studentName: student.name,
      studentPhone: student.phone,
      course: student.course,
      message: messageText.trim(),
      createdAt: timeStr,
      timestamp: Date.now(),
      status: 'UNREAD'
    };

    all.unshift(newMsg);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
        // Auto Sync to Cloud
        syncMessageToCloud(newMsg);
        window.dispatchEvent(new Event('vajra_messages_updated'));
      } catch (e) {
        console.error(e);
      }
    }
    return newMsg;
  }

  static replyToMessage(messageId: string, replyText: string): boolean {
    const all = this.getAllMessages();
    const msg = all.find(m => m.id === messageId);
    if (!msg) return false;

    msg.reply = replyText.trim();
    msg.repliedAt = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    msg.status = 'REPLIED';

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
        // Auto Sync reply to Cloud
        replyMessageInCloud(messageId, replyText.trim());
        window.dispatchEvent(new Event('vajra_messages_updated'));
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  static deleteMessage(messageId: string): boolean {
    let all = this.getAllMessages();
    all = all.filter(m => m.id !== messageId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
        // Auto Delete from Cloud
        deleteMessageFromCloud(messageId);
        window.dispatchEvent(new Event('vajra_messages_updated'));
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  static syncMessagesFromCloud(cloudMessages: VajraMessage[]) {
    if (typeof window === 'undefined' || !cloudMessages) return;
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(cloudMessages));
      window.dispatchEvent(new Event('vajra_messages_updated'));
    } catch (e) {
      console.error(e);
    }
  }
}
