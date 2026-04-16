import { fetchWithAuth } from "../apiClient";

// create time-table slot 
export const createTimeTableSlot = async (data) => {
    return await fetchWithAuth(`/timetable/time-slot`, {
        method: "POST",
        body: JSON.stringify(data)
    })
}

// create time-table slot 
export const createTimeTable = async (data) => {
    return await fetchWithAuth(`/timetable`, {
        method: "POST",
        body: JSON.stringify(data)
    })
}

// get time-slots
export const getTimeSlots = async () => {
    return await fetchWithAuth(`/timetable/time-slots`, {
        method: "GET"
    })
}

// get particular time-slots
export const getParticularTimeSlots = async (id) => {
    return await fetchWithAuth(`/timetable/time-slots/${id}`, {
        method: "GET"
    })
}

// get class time-table
export const getClassTimetable = async (classId, sectionId) => {
    return await fetchWithAuth(`/timetable/${classId}?classSectionId=${sectionId}&page=${1}&limit=${10}`, {
        method: "GET"
    })
}

// get time-table
export const getTimetable = async (id) => {
    return await fetchWithAuth(`/timetable/${id}`, {
        method: "GET"
    })
}