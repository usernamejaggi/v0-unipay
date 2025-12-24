import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
)

if (!isFirebaseConfigured && typeof window !== "undefined") {
  console.warn("[v0] Firebase configuration is missing. Please add Firebase environment variables.")
}

// Initialize Firebase only if configured
let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null
let storage: ReturnType<typeof getStorage> | null = null

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { auth, db, storage }

export const googleProvider = new GoogleAuthProvider()

// Admin password for admin@unipay.com
export const ADMIN_PASSWORD = "JaggiIsBoss$0667"
export const ADMIN_EMAILS = ["admin@unipay.com", "support@unipay.com"]

// Types
export type VerificationStatus = "not-submitted" | "under-review" | "approved" | "rejected"
export type SubscriptionPlan = "free" | "starter" | "pro"

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  college?: string
  degree?: string
  year?: string
  stream?: string
  enrollmentNumber?: string
  skills?: string[]
  interests?: string[]
  verificationStatus: VerificationStatus
  isAdmin: boolean
  freeTasksUsed: number
  totalFreeTasks: number
  subscription: SubscriptionPlan
  subscriptionExpiry?: string
  totalEarnings: number
  rating: number
  streak: number
  tasksCompleted: number
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  selfieUrl?: string
  idCardUrl?: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: "testing" | "survey" | "remote"
  reward: number
  estimatedTime: string
  deadline: string
  instructions: string[]
  requirements: string[]
  capacity: number
  applicants: string[]
  approvedUsers: string[]
  completedBy: string[]
  isActive: boolean
  createdAt: Timestamp | null
  createdBy: string
}

export interface TaskApplication {
  id: string
  taskId: string
  userId: string
  userName: string
  userEmail: string
  status: "applied" | "approved" | "rejected" | "completed"
  appliedAt: Timestamp | null
  reviewedAt?: Timestamp | null
  completedAt?: Timestamp | null
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "task" | "verification" | "payment" | "system"
  read: boolean
  createdAt: Timestamp | null
  link?: string
}

export interface UniversityUpdate {
  id: string
  title: string
  content: string
  category: "announcement" | "event" | "opportunity" | "news"
  createdAt: Timestamp | null
  createdBy: string
  isActive: boolean
}

export interface IdeaSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  title: string
  category: string
  problemStatement: string
  proposedSolution: string
  skillRequirements: string[]
  estimatedTime: string
  proposedPrice: number
  capacity: number
  deliverables: string[]
  supportingFileUrl?: string
  adminPrice?: number
  adminCapacity?: number
  rejectionReason?: string
  status: "pending" | "approved" | "rejected" | "converted"
  submittedAt: Timestamp | null
  reviewedAt?: Timestamp | null
  reviewedBy?: string
  convertedToTaskId?: string
}

export interface VerificationSubmission {
  id: string
  userId: string
  studentName: string
  email: string
  collegeName: string
  enrollmentNumber: string
  year: string
  stream: string
  skills: string[]
  interests: string[]
  selfieUrl: string
  idCardUrl: string
  submittedAt: Timestamp | null
  status: VerificationStatus
  reviewedAt?: Timestamp | null
  reviewedBy?: string
}

// Auth functions
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth as any, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    return { user: null, error: firebaseError.message || "Failed to sign in" }
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth as any, googleProvider)
    const user = result.user

    // Check if user profile exists
    const existingProfile = await getUserProfile(user.uid)

    if (!existingProfile) {
      // Create user profile in Firestore for new Google users
      const userProfile: Omit<UserProfile, "id"> = {
        email: user.email || "",
        name: user.displayName || user.email?.split("@")[0] || "User",
        avatar: user.photoURL || "",
        verificationStatus: "not-submitted",
        isAdmin: ADMIN_EMAILS.includes((user.email || "").toLowerCase()),
        freeTasksUsed: 0,
        totalFreeTasks: 10,
        subscription: "free",
        totalEarnings: 0,
        rating: 0,
        streak: 0,
        tasksCompleted: 0,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      }
      await setDoc(doc(db as any, "users", user.uid), userProfile)
    }

    return { user, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    return { user: null, error: firebaseError.message || "Failed to sign in with Google" }
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth as any, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    const userProfile: Omit<UserProfile, "id"> = {
      email: user.email || email,
      name: name,
      avatar: "",
      verificationStatus: "not-submitted",
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
      freeTasksUsed: 0,
      totalFreeTasks: 10,
      subscription: "free",
      totalEarnings: 0,
      rating: 0,
      streak: 0,
      tasksCompleted: 0,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    }

    await setDoc(doc(db as any, "users", user.uid), userProfile)

    return { user, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    return { user: null, error: firebaseError.message || "Failed to sign up" }
  }
}

export async function logOut() {
  try {
    await signOut(auth as any)
    return { error: null }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }
    return { error: firebaseError.message || "Failed to sign out" }
  }
}

// User functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db as any, "users", userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile
    }
    return null
  } catch {
    return null
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  try {
    const docRef = doc(db as any, "users", userId)
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
    return { error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { error: firebaseError.message || "Failed to update profile" }
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(db as any, "users"))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UserProfile)
  } catch {
    return []
  }
}

// Verification functions
export async function submitVerification(data: Omit<VerificationSubmission, "id" | "submittedAt" | "status">) {
  try {
    const docRef = doc(collection(db as any, "verifications"))
    const verification: Omit<VerificationSubmission, "id"> = {
      ...data,
      status: "under-review",
      submittedAt: serverTimestamp() as Timestamp,
    }
    await setDoc(docRef, verification)

    // Update user's verification status
    await updateUserProfile(data.userId, { verificationStatus: "under-review" })

    // Create notification
    await createNotification({
      userId: data.userId,
      title: "Verification Submitted",
      message: "Your verification documents have been submitted for review.",
      type: "verification",
    })

    return { id: docRef.id, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { id: null, error: firebaseError.message || "Failed to submit verification" }
  }
}

export async function getVerifications(): Promise<VerificationSubmission[]> {
  try {
    const q = query(collection(db as any, "verifications"), orderBy("submittedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as VerificationSubmission)
  } catch {
    return []
  }
}

export async function updateVerificationStatus(
  verificationId: string,
  userId: string,
  status: VerificationStatus,
  reviewedBy: string,
) {
  try {
    const docRef = doc(db as any, "verifications", verificationId)
    await updateDoc(docRef, {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy,
    })

    // Update user's verification status
    await updateUserProfile(userId, { verificationStatus: status })

    // Create notification
    await createNotification({
      userId,
      title: status === "approved" ? "Verification Approved" : "Verification Update",
      message:
        status === "approved"
          ? "Congratulations! Your account has been verified. You can now apply for tasks."
          : "Your verification status has been updated. Please check your profile.",
      type: "verification",
      link: "/dashboard",
    })

    return { error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { error: firebaseError.message || "Failed to update verification" }
  }
}

// Task functions
export async function getTasks(): Promise<Task[]> {
  try {
    const q = query(collection(db as any, "tasks"), where("isActive", "==", true), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Task)
  } catch {
    return []
  }
}

export async function createTask(
  data: Omit<Task, "id" | "createdAt" | "applicants" | "approvedUsers" | "completedBy">,
) {
  try {
    const docRef = doc(collection(db as any, "tasks"))
    const task: Omit<Task, "id"> = {
      ...data,
      applicants: [],
      approvedUsers: [],
      completedBy: [],
      createdAt: serverTimestamp() as Timestamp,
    }
    await setDoc(docRef, task)
    return { id: docRef.id, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { id: null, error: firebaseError.message || "Failed to create task" }
  }
}

export async function applyForTask(taskId: string, userId: string, userName: string, userEmail: string) {
  try {
    // Create application
    const appRef = doc(collection(db as any, "taskApplications"))
    const application: Omit<TaskApplication, "id"> = {
      taskId,
      userId,
      userName,
      userEmail,
      status: "applied",
      appliedAt: serverTimestamp() as Timestamp,
    }
    await setDoc(appRef, application)

    // Update task applicants
    const taskRef = doc(db as any, "tasks", taskId)
    const taskDoc = await getDoc(taskRef)
    if (taskDoc.exists()) {
      const applicants = taskDoc.data().applicants || []
      await updateDoc(taskRef, { applicants: [...applicants, userId] })
    }

    return { id: appRef.id, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { id: null, error: firebaseError.message || "Failed to apply for task" }
  }
}

export async function getUserTaskApplications(userId: string): Promise<TaskApplication[]> {
  try {
    const q = query(collection(db as any, "taskApplications"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TaskApplication)
  } catch {
    return []
  }
}

// Ideas functions
export async function submitIdea(data: Omit<IdeaSubmission, "id" | "submittedAt" | "status">) {
  try {
    const docRef = doc(collection(db as any, "ideas"))
    const idea: Omit<IdeaSubmission, "id"> = {
      ...data,
      status: "pending",
      submittedAt: serverTimestamp() as Timestamp,
    }
    await setDoc(docRef, idea)
    return { id: docRef.id, error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { id: null, error: firebaseError.message || "Failed to submit idea" }
  }
}

export async function getIdeas(): Promise<IdeaSubmission[]> {
  try {
    const q = query(collection(db as any, "ideas"), orderBy("submittedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IdeaSubmission)
  } catch {
    return []
  }
}

export async function getUserIdeas(userId: string): Promise<IdeaSubmission[]> {
  try {
    const q = query(collection(db as any, "ideas"), where("userId", "==", userId), orderBy("submittedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IdeaSubmission)
  } catch {
    return []
  }
}

export async function updateIdeaStatus(
  ideaId: string,
  userId: string,
  status: "approved" | "rejected",
  reviewedBy: string,
  adminPrice?: number,
  adminCapacity?: number,
  rejectionReason?: string,
) {
  try {
    const docRef = doc(db as any, "ideas", ideaId)
    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy,
    }
    if (adminPrice) updateData.adminPrice = adminPrice
    if (adminCapacity) updateData.adminCapacity = adminCapacity
    if (rejectionReason) updateData.rejectionReason = rejectionReason

    await updateDoc(docRef, updateData)

    // Create notification
    await createNotification({
      userId,
      title: status === "approved" ? "Idea Approved" : "Idea Reviewed",
      message:
        status === "approved"
          ? "Your idea has been approved and will be converted to a task!"
          : `Your idea has been reviewed. ${rejectionReason || ""}`,
      type: "task",
      link: "/my-submissions",
    })

    return { error: null }
  } catch (error: unknown) {
    const firebaseError = error as { message?: string }
    return { error: firebaseError.message || "Failed to update idea" }
  }
}

// Notification functions
export async function createNotification(data: Omit<Notification, "id" | "createdAt" | "read">) {
  try {
    const docRef = doc(collection(db as any, "notifications"))
    const notification: Omit<Notification, "id"> = {
      ...data,
      read: false,
      createdAt: serverTimestamp() as Timestamp,
    }
    await setDoc(docRef, notification)
    return { id: docRef.id, error: null }
  } catch {
    return { id: null, error: "Failed to create notification" }
  }
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const q = query(collection(db as any, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Notification)
  } catch {
    return []
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    const docRef = doc(db as any, "notifications", notificationId)
    await updateDoc(docRef, { read: true })
    return { error: null }
  } catch {
    return { error: "Failed to mark notification as read" }
  }
}

export async function markAllNotificationsRead(userId: string) {
  try {
    const q = query(collection(db as any, "notifications"), where("userId", "==", userId), where("read", "==", false))
    const querySnapshot = await getDocs(q)
    const updates = querySnapshot.docs.map((doc) => updateDoc(doc.ref, { read: true }))
    await Promise.all(updates)
    return { error: null }
  } catch {
    return { error: "Failed to mark all notifications as read" }
  }
}

// University Updates functions
export async function getUniversityUpdates(): Promise<UniversityUpdate[]> {
  try {
    const q = query(
      collection(db as any, "universityUpdates"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UniversityUpdate)
  } catch {
    return []
  }
}

export async function createUniversityUpdate(data: Omit<UniversityUpdate, "id" | "createdAt">) {
  try {
    const docRef = doc(collection(db as any, "universityUpdates"))
    const update: Omit<UniversityUpdate, "id"> = {
      ...data,
      createdAt: serverTimestamp() as Timestamp,
    }
    await setDoc(docRef, update)
    return { id: docRef.id, error: null }
  } catch {
    return { id: null, error: "Failed to create update" }
  }
}

// File upload
export async function uploadFile(file: File, path: string): Promise<string | null> {
  try {
    const storageRef = ref(storage as any, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
  } catch {
    return null
  }
}

// Real-time listeners
export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  const q = query(collection(db as any, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Notification)
    callback(notifications)
  })
}

export function subscribeToUserProfile(userId: string, callback: (profile: UserProfile | null) => void) {
  const docRef = doc(db as any, "users", userId)
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as UserProfile)
    } else {
      callback(null)
    }
  })
}

export function subscribeToVerifications(callback: (verifications: VerificationSubmission[]) => void) {
  const q = query(collection(db as any, "verifications"), orderBy("submittedAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const verifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as VerificationSubmission)
    callback(verifications)
  })
}

export function subscribeToIdeas(callback: (ideas: IdeaSubmission[]) => void) {
  const q = query(collection(db as any, "ideas"), orderBy("submittedAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const ideas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IdeaSubmission)
    callback(ideas)
  })
}

export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  const q = query(collection(db as any, "tasks"), where("isActive", "==", true), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Task)
    callback(tasks)
  })
}

export { onAuthStateChanged, type User }
