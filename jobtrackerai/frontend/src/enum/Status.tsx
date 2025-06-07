export const Status = {
    InProgress: "In Progress",
    Interview: "Interview",
    Rejected: "Rejected",
    Offered: "Offered",
    Accepted: "Accepted"
}
export type StatusType = typeof Status[keyof typeof Status];
