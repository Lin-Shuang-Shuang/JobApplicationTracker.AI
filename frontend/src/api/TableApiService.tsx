import type {TableRow} from "../interface/TableRow"

const url = "http://localhost:8080"

export function getTableData(): Promise<TableRow[]> {
    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    const request: RequestInfo = new Request(url + "/table", {
        method: "GET",
        headers: headers
    })
    return fetch(request)
    .then(res => res.json())
    .then(res => {
        return res as TableRow[]
    })
}

export function updateStatus(id: number, newStatus: string): Promise<void> {
    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    
    const request: RequestInfo = new Request(`${url}/table/status?id=${id}&newStatus=${newStatus}`, {
        method: "PUT",
        headers: headers,
        
    })
    return fetch(request).then(res => {
        if (!res.ok) {
            throw new Error('Failed to update status')
        }
    })
}

export function updateApplication(id: number, data: Partial<TableRow>): Promise<void> {
    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    
    const request: RequestInfo = new Request(`${url}/table/update?id=${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data)
    })
    return fetch(request).then(res => {
        if (!res.ok) {
            throw new Error('Failed to update application')
        }
    })
}

export function deleteApplications(ids: number[]): Promise<void> {
    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    
    const request: RequestInfo = new Request(`${url}/table/delete`, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ ids })
    })
    return fetch(request).then(res => {
        if (!res.ok) {
            throw new Error('Failed to delete applications')
        }
    })
}

export function uploadJobDescription(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const request: RequestInfo = new Request(`${url}/upload/job-description`, {
        method: "POST",
        body: formData
    })

    return fetch(request).then(res => {
        if (!res.ok) {
            throw new Error('Failed to process job description')
        }
    })
}