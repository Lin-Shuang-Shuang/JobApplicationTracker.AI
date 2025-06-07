import { type StatusType } from "../enum/Status"
export interface TableRow {
    id: number,
    company: string,
    jobPosition: string,
    status: StatusType,
    dateApplied: string
}

