// "use client"

// import React, { useState } from "react"
// import { Bell, CheckCheck, Trash2, Calendar, BookOpen, AlertCircle, Info } from "lucide-react"
// import { Drawer } from "./Drawer"
// import { Badge } from "@/components/ui/Badge"
// import { Button } from "@/components/ui/Button"
// import { cn } from "@/lib/utils"

// export interface NotificationItem {
//   id: string
//   title: string
//   message: string
//   timestamp: string
//   type: "academic" | "assignment" | "alert" | "info"
//   isRead: boolean
// }

// const INITIAL_NOTIFICATIONS: NotificationItem[] = [
//   // todo: set null dulu
// ]

// export interface NotificationDrawerProps {
//   trigger?: React.ReactNode
//   variant?: "header" | "default"
//   triggerClassName?: string
// }

// export function NotificationDrawer({
//   trigger,
//   variant = "header",
//   triggerClassName,
// }: NotificationDrawerProps = {}) {
//   const [open, setOpen] = useState(false)
//   const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
//   const [filter, setFilter] = useState<"all" | "unread">("all")

//   const unreadCount = notifications.filter((n) => !n.isRead).length
//   const filteredNotifications = notifications.filter((n) =>
//     filter === "unread" ? !n.isRead : true
//   )

//   const handleMarkAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
//   }

//   const handleClearAll = () => {
//     setNotifications([])
//   }

//   const handleToggleRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
//     )
//   }

//   const getIcon = (type: NotificationItem["type"]) => {
//     switch (type) {
//       case "academic":
//         return <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//       case "assignment":
//         return <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
//       case "alert":
//         return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//       default:
//         return <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
//     }
//   }

//   const defaultTrigger = (
//     <button
//       type="button"
//       className={cn(
//         variant === "header"
//           ? "bg-white/20 hover:bg-white/30 text-white rounded-[14px] w-9 h-9 flex items-center justify-center transition-colors relative cursor-pointer focus:outline-none"
//           : "relative inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer",
//         triggerClassName
//       )}
//       aria-label="Buka Notifikasi"
//     >
//       <Bell className="h-5 w-5 text-white" />
//       {unreadCount > 0 && (
//         <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs border-2 border-[#2a7fff]">
//           {unreadCount}
//         </span>
//       )}
//     </button>
//   )

//   return (
//     <ResponsiveDrawer
//       open={open}
//       onOpenChange={setOpen}
//       trigger={trigger || defaultTrigger}
//       title={
//         <div className="flex items-center justify-between w-full pr-6">
//           <div className="flex items-center gap-2">
//             <span className="font-bold text-lg text-gray-900 dark:text-white">Notifications</span>
//             {unreadCount > 0 && (
//               <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200">
//                 {unreadCount} New
//               </Badge>
//             )}
//           </div>
//         </div>
//       }
//       footer={
//         <div className="flex items-center justify-between w-full">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleMarkAllAsRead}
//             disabled={unreadCount === 0}
//             className="text-xs text-gray-600 hover:text-gray-900"
//           >
//             <CheckCheck className="h-3.5 w-3.5 mr-1" />
//             Mark All as Read
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleClearAll}
//             disabled={notifications.length === 0}
//             className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
//           >
//             <Trash2 className="h-3.5 w-3.5 mr-1" />
//             Clear
//           </Button>
//         </div>
//       }
//     >
//       {/* Filter Tabs */}
//       <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
//         <button
//           type="button"
//           onClick={() => setFilter("all")}
//           className={cn(
//             "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
//             filter === "all"
//               ? "bg-blue-600 text-white shadow-xs font-bold"
//               : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//           )}
//         >
//           All ({notifications.length})
//         </button>
//         <button
//           type="button"
//           onClick={() => setFilter("unread")}
//           className={cn(
//             "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
//             filter === "unread"
//               ? "bg-blue-600 text-white shadow-xs font-bold"
//               : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
//           )}
//         >
//           Unread ({unreadCount})
//         </button>
//       </div>

//       {/* Notification List */}
//       {filteredNotifications.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
//           <Bell className="h-10 w-10 mb-2 stroke-1 opacity-50" />
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//             {filter === "unread" ? "No unread notifications" : "No notifications"}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">You have seen all academic updates.</p>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {filteredNotifications.map((notif) => (
//             <div
//               key={notif.id}
//               onClick={() => handleToggleRead(notif.id)}
//               className={cn(
//                 "p-3.5 rounded-xl border transition-all cursor-pointer relative flex gap-3 items-start",
//                 notif.isRead
//                   ? "bg-white border-gray-100 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800"
//                   : "bg-blue-50/50 border-blue-100 hover:border-blue-200 dark:bg-blue-950/30 dark:border-blue-900"
//               )}
//             >
//               <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xs shrink-0">
//                 {getIcon(notif.type)}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between gap-2 mb-1">
//                   <h4 className={cn("text-xs font-bold truncate", notif.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white")}>
//                     {notif.title}
//                   </h4>
//                   {!notif.isRead && (
//                     <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-1.5">
//                   {notif.message}
//                 </p>
//                 <span className="text-[10px] text-gray-400 block font-medium">
//                   {notif.timestamp}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </ResponsiveDrawer>
//   )
// }

// export default NotificationDrawer
