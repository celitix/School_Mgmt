import React, { useState, useEffect } from 'react';
import { Dialog } from "primereact/dialog";
import toast from 'react-hot-toast';
import { Calendar } from "primereact/calendar";

// APIS 
import { getTimeSlots, createTimeTableSlot, getParticularTimeSlots, createTimeTable, getClassTimetable } from "@/apis/timeTables/timeTables";
import { getAllClasses, getParticularClassSection, getAllTeachers, getClassSubjects } from '../apis/classAndsections/classAndsections';

// COMPONENTS 
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import UniversalTabs from "@/components/common/UniversalTabs";

function SchoolTimeTable({ timetable, classDetails }) {

    const timeSlots = [
        "09:00 AM-09:45 AM",
        "10:00 AM-10:45 AM",
        "11:00 AM-11:45 AM",
        "12:00-12:45 PM",
        "01:00 PM-02:00 PM",
        "02:00 PM-02:45 PM",
    ];

    const days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
    ];

    return (
        <div className="p-6 bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-md w-full">
            <div className='text-xl font-semibold my-2'>
                <h2>{classDetails?.name} {classDetails?.section}</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 text-center">

                    <thead>
                        <tr>
                            <th className="p-3 border border-[var(--border)] bg-[var(--hover)]">
                                Time
                            </th>
                            {days.map((day) => (
                                <th key={day} className="p-3 border border-[var(--border)] bg-[var(--hover)]">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {timeSlots.map((slot) => (
                            <tr key={slot}>
                                <td className="p-3 border border-[var(--border)] font-medium bg-[var(--hover)]">
                                    {slot}
                                </td>

                                {days.map((day) => {
                                    const cell = timetable?.[day]?.[slot];

                                    return (
                                        <td key={day} className="p-4 border border-[var(--border)]">
                                            {cell ? (
                                                <div>
                                                    <p className="font-semibold">{cell.subject}</p>
                                                    <p className="text-xs text-[var(--muted-text)]">
                                                        {cell.teacher}
                                                    </p>
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

const TimeTableManagement = () => {
    const TabItem = ({ children }) => {
        return <>{children}</>;
    };
    return (
        <div>
            {/* <div className='flex items-center justify-center text-2xl font-semibold'>Subject Management</div> */}
            <UniversalTabs>

                <TabItem label="Time Table Slots">
                    <TimeTableSlot />
                </TabItem>

                <TabItem label="Time Table">
                    <TimeTable />
                </TabItem>

            </UniversalTabs>
        </div>
    )

}

const TimeTableSlot = () => {
    const [timeTableSlots, setTimeTableSlots] = useState([]);
    const [openAddTimeSlot, setOpenAddTimeSlot] = useState(false);
    const [addSlotForm, setAddSlotForm] = useState({
        slotName: "",
        startTime: "",
        endTime: "",
    });
    const [openViewTimeTable, setOpenViewTimeTable] = useState(false)
    const [slotData, setSlotData] = useState([])
    const [searchedSlot, setSearchedSlot] = useState("");
    const [filteredSlots, setFilteredSlots] = useState([]);

    const fetchTimeTableSlots = async () => {
        try {
            const res = await getTimeSlots()
            if (res.isSuccess) {
                setTimeTableSlots(res?.data.slots)
                setFilteredSlots(res?.data.slots)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchTimeTableSlots()
    }, [])

    const formatTime = (date) => {
        if (!date) return "";

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleAddSlot = async () => {
        const data = {
            label: addSlotForm.slotName,
            startTime: formatTime(addSlotForm.startTime),
            endTime: formatTime(addSlotForm.endTime),
        }
        try {
            const res = await createTimeTableSlot(data)
            if (res?.isSuccess) {
                toast.success(res?.data?.message)
                fetchTimeTableSlots()
                setOpenAddTimeSlot(false)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleTimetableView = async (id) => {
        setOpenViewTimeTable(true)
        try {
            const res = await getParticularTimeSlots(id);
            if (res?.isSuccess) {
                setSlotData(res?.data?.slot)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        if (!searchedSlot.trim()) {
            setFilteredSlots(timeTableSlots);
            return;
        }

        const filtered = timeTableSlots.filter((slot) =>
            slot.label?.toLowerCase().includes(searchedSlot.toLowerCase())
        );

        setFilteredSlots(filtered);
    }, [searchedSlot, timeTableSlots]);

    const highlightText = (text, highlight) => {
        if (!highlight) return text;

        const regex = new RegExp(`(${highlight})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} className="bg-yellow-200 font-semibold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div>
            <div className='flex items-center justify-center text-2xl font-semibold'>Time Table Slots</div>
            <div className='flex flex-col md:flex-row md:flex-wrap md:justify-end my-4 gap-2'>
                <div className='flex md:flex-row flex-col gap-2'>
                    <InputField
                        placeholder="Search Time Slot"
                        value={searchedSlot}
                        onChange={(e) => setSearchedSlot(e.target.value)}
                    />
                    <UniversalButton label="Search" onClick={fetchTimeTableSlots} />
                </div>

                <UniversalButton label="Create TimeTable slot" onClick={() => setOpenAddTimeSlot(true)} />

            </div>
            <div className='theme-container'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSlots.map((slot) => (
                        <div
                            key={slot.id}
                            className="group card relative overflow-hidden"
                        >
                            <h2 className='card-title'>{highlightText(slot?.label, searchedSlot)}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Start Time{" "}
                                {slot.startTime}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                End Time{" "}
                                {slot.endTime}
                            </p>

                            {/* Divider */}
                            <div className="my-4 card-divider" />

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <button className="text-sm font-medium text-indigo-600 hover:underline" onClick={() => handleTimetableView(slot.id)}>
                                    View
                                </button>
                            </div>

                            <div className='absolute right-2 top-2 text-xl text-gray-600 cursor-pointer'>
                                {/* <IoMdTrash /> */}
                            </div>

                        </div>
                    ))}
                </div>

                {
                    filteredSlots.length === 0 && (
                        <div className="h-[40rem] flex flex-col items-center justify-center">

                            {/* Large Faded Background Text */}
                            <h1 className="absolute md:text-[120px] text-[60px] font-bold theme-empty-bg-text select-none pointer-events-none">
                                EMPTY
                            </h1>

                            {/* Message */}
                            <h2 className="text-2xl theme-empty-title z-10">
                                No Data Available
                            </h2>

                            <p className="theme-empty-subtitle mt-2 z-10 max-w-sm text-center">
                                Please type valid year <br />
                                Try again
                            </p>

                        </div>
                    )
                }
            </div>
            <Dialog
                header="Add Time slot"
                visible={openAddTimeSlot}
                style={{ width: "36rem" }}
                onHide={() => setOpenAddTimeSlot(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col justify-center items-center gap-2'>
                    <div className='w-full'>
                        <InputField
                            label="Enter Slot Name"
                            placeholder="Enter slot name"
                            tooltipContent="Enter slot name"
                            value={addSlotForm.slotName}
                            onChange={(e) => setAddSlotForm((prev) => ({
                                ...prev,
                                slotName: e.target.value
                            }))}
                        />
                    </div>
                    <div className="w-full relative">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">
                                Enter Start Time
                            </label>

                            <Calendar
                                value={addSlotForm.startTime}
                                onChange={(e) =>
                                    setAddSlotForm((prev) => ({
                                        ...prev,
                                        startTime: e.value,
                                    }))
                                }
                                timeOnly
                                hourFormat="12"
                                placeholder="Select Start Time"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="w-full relative">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">
                                Enter End Time
                            </label>

                            <Calendar
                                value={addSlotForm.endTime}
                                onChange={(e) =>
                                    setAddSlotForm((prev) => ({
                                        ...prev,
                                        endTime: e.value,
                                    }))
                                }
                                timeOnly
                                hourFormat="12"
                                placeholder="Select End Time"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <UniversalButton label="Add Slot" onClick={handleAddSlot} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="View Time slot"
                visible={openViewTimeTable}
                style={{ width: "36rem" }}
                onHide={() => setOpenViewTimeTable(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className=" p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                        {slotData.label}
                    </h3>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">{slotData.startTime}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">End:</span>
                        <span className="font-medium">{slotData.endTime}</span>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

const TimeTable = () => {
    const [timeTableSlots, setTimeTableSlots] = useState([]);
    const [timetableForm, setTimeTableForm] = useState({
        classId: "",
        sectionId: "",
        subjectId: "",
        teacherId: "",
        dayOfWeek: "",
        timeSlotId: ""
    })
    const [openConfigureTimeTable, setOpenConfigureTimeTable] = useState(false)
    const [subjectList, setSubjectList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sectionDetails, setSectionDetails] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [timeTableData, setTimeTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchTimeTableSlots = async () => {
        try {
            const res = await getTimeSlots()
            if (res.isSuccess) {
                setTimeTableSlots(res?.data.slots)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchTimeTableSlots()
    }, [])

    const fetchSubjectList = async (id) => {
        try {
            const res = await getClassSubjects(id);
            if (res?.isSuccess) {
                setSubjectList(res?.data?.data)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const subjectOptions = subjectList?.map((sub, i) => ({
        label: sub?.subject.name,
        value: sub?.subject.id
    }))

    const fetchAllClasses = async () => {
        try {
            const response = await getAllClasses()
            setClasses(response?.data?.allClass)
        } catch (error) {
            console.log("error", error)
        }
    }

    const classOptions = classes.map((cls, i) => ({
        label: cls.name,
        value: cls.id
    }))

    const fetchParticularClassSection = async (id) => {
        const classId = id
        try {
            const response = await getParticularClassSection(classId)
            if (response?.isSuccess) {
                setSectionDetails(response?.data?.sections)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const sectionOptions = sectionDetails?.map((sec, i) => ({
        label: sec.name,
        value: sec.id
    }))



    const fetchAllTeachers = async () => {
        try {
            const res = await getAllTeachers()
            if (res?.isSuccess) {
                setTeachersList(res?.data?.teachers)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const teachersOptions = teachersList?.map((teacher, index) => ({
        label: teacher?.user?.name,
        value: teacher.id
    }))

    const slotsOptions = timeTableSlots?.map((slot, index) => ({
        label: slot?.label,
        value: slot.id
    }))

    const dayOfWeekOptions = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => ({
        label: day,
        value: day
    }))


    useEffect(() => {
        fetchAllClasses()
        fetchAllTeachers()
    }, [openConfigureTimeTable])

    useEffect(() => {
        const id = timetableForm?.classId || selectedClassId
        if (timetableForm?.classId || selectedClassId) {
            fetchParticularClassSection(id)
        }
    }, [timetableForm?.classId, selectedClassId])

    useEffect(() => {
        if (timetableForm?.classId) {
            fetchSubjectList(timetableForm?.classId)
        }
    }, [timetableForm?.classId])

    const handleCreateTimetable = async () => {
        setIsLoading(true)
        const data = {
            classId: timetableForm.classId,
            sectionId: timetableForm.sectionId,
            subjectId: timetableForm.subjectId,
            teacherId: timetableForm.teacherId,
            dayOfWeek: timetableForm.dayOfWeek,
            timeSlotId: timetableForm.timeSlotId
        }
        try {
            const res = await createTimeTable(data);
            if (res?.isSuccess) {
                toast.success(res.data.message);
                setOpenConfigureTimeTable(false)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTimeTable = async (classId) => {
        if (!classId) {
            return
        }
        if (!selectedSectionId) {
            return
        }
        try {
            const res = await getClassTimetable(classId, selectedSectionId)
            if (res?.isSuccess) {
                toast.success(res?.data.message)
                setTimeTableData(res?.data?.timetables)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        if (selectedClassId && selectedSectionId) {
            fetchTimeTable(selectedClassId)
        }
    }, [selectedClassId, selectedSectionId])



    const timetable = timeTableData.reduce((acc, item) => {
        const day = item.dayOfWeek;

        const timeRange = `${item.timeSlot.startTime}-${item.timeSlot.endTime}`;

        if (!acc[day]) {
            acc[day] = {};
        }

        acc[day][timeRange] = {
            subject: item.subject.name,
            teacher: item.teacher.user.name,
        };

        return acc;
    }, {});

    const classDetails = {
        name: "Class 2",
        section: timeTableData[0]?.section?.name
    }

    return (
        <div>
            <div className='flex items-center justify-center text-2xl font-semibold'>Time Table Management</div>
            <div className='flex md:flex-row flex-col justify-end my-4 gap-4'>
                <div className='w-full md:w-56'>
                    <DropdownWithSearch
                        // label="Select Class"
                        options={classOptions}
                        value={selectedClassId}
                        placeholder="Select Class"
                        onChange={(value) =>
                            setSelectedClassId(value)
                        }
                    />
                </div>
                <div className='w-full md:w-56'>
                    <DropdownWithSearch
                        // label="Select Class"
                        options={sectionOptions}
                        value={selectedSectionId}
                        placeholder="Select Section"
                        onChange={(value) =>
                            setSelectedSectionId(value)
                        }
                    />
                </div>

                <UniversalButton label="Search" onClick={() => fetchTimeTable(selectedClassId)} />

                <UniversalButton label="Configure TimeTable" onClick={() => setOpenConfigureTimeTable(true)} />

            </div>

            <div className='my-6'>

                <div className="w-full flex items-center justify-center rounded-xl shadow-xl theme-container">

                    {(!selectedClassId || !selectedSectionId) && (
                        <div className="flex justify-center items-center h-[40rem] w-full">
                            <div className="empty-state-card text-center">
                                <div className="empty-icon mb-4 text-5xl">
                                    📖
                                </div>

                                <h2 className="text-2xl font-semibold mb-2">
                                    No Class or Section Selected
                                </h2>

                                <p className="text-[var(--muted-text)]">
                                    Please select both class and section to view the subjects.
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedClassId && timeTableData?.length > 0 && (
                        <div className="w-full relative">
                            <SchoolTimeTable
                                timetable={timetable}
                                classDetails={classDetails}
                            />
                        </div>
                    )}

                    {selectedClassId && selectedSectionId && timeTableData?.length === 0 && (
                        <div className="h-[36rem] w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">

                            {/* Background Text */}
                            <h1 className="absolute md:text-[120px] text-[60px] font-bold text-gray-100 select-none pointer-events-none">
                                EMPTY
                            </h1>

                            {/* Message */}
                            <h2 className="text-2xl font-semibold text-gray-800 z-10">
                                No Data Available
                            </h2>

                            <p className="text-gray-500 mt-2 z-10 max-w-sm text-center">
                                This class has no time-table <br />
                                Select another class
                            </p>
                        </div>
                    )}

                </div>
            </div>

            <Dialog
                header="Configure TimeTable"
                visible={openConfigureTimeTable}
                style={{ width: "36rem" }}
                onHide={() => setOpenConfigureTimeTable(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col justify-center items-center gap-4'>
                    <div className='w-full'>
                        <DropdownWithSearch
                            label="Select Class"
                            options={classOptions}
                            placeholder="Select a class"
                            value={timetableForm.classId}
                            tooltipContent="Select class"
                            onChange={(value) =>
                                setTimeTableForm((prev) => ({
                                    ...prev,
                                    classId: value
                                }))
                            }
                        />
                    </div>

                    {timetableForm?.classId && (
                        <div className='w-full'>
                            <DropdownWithSearch
                                label="Select Section"
                                options={sectionOptions}
                                placeholder="Select a section"
                                value={timetableForm.sectionId}
                                tooltipContent="Select section"
                                onChange={(value) =>
                                    setTimeTableForm((prev) => ({
                                        ...prev,
                                        sectionId: value
                                    }))
                                }
                            />
                        </div>
                    )}

                    <div className='w-full'>
                        <DropdownWithSearch
                            label="Select Subject"
                            options={subjectOptions}
                            placeholder="Select a subject"
                            tooltipContent="Select subject"
                            value={timetableForm.subjectId}
                            onChange={(value) =>
                                setTimeTableForm((prev) => ({
                                    ...prev,
                                    subjectId: value
                                }))
                            }
                        />
                    </div>

                    <div className='w-full'>
                        <DropdownWithSearch
                            label="Select Teacher"
                            options={teachersOptions}
                            placeholder="Select a teacher"
                            tooltipContent="Select teacher"
                            value={timetableForm.teacherId}
                            onChange={(value) =>
                                setTimeTableForm((prev) => ({
                                    ...prev,
                                    teacherId: value
                                }))
                            }
                        />
                    </div>

                    <div className='w-full'>
                        <DropdownWithSearch
                            label="Select day"
                            options={dayOfWeekOptions}
                            placeholder="Select a day"
                            tooltipContent="Select a day of the week"
                            value={timetableForm.dayOfWeek}
                            onChange={(value) =>
                                setTimeTableForm((prev) => ({
                                    ...prev,
                                    dayOfWeek: value
                                }))
                            }
                        />
                    </div>

                    <div className='w-full'>
                        <DropdownWithSearch
                            label="Select Slot"
                            tooltipContent="Select slot"
                            placeholder="Select a slot"
                            options={slotsOptions}
                            value={timetableForm.timeSlotId}
                            onChange={(value) =>
                                setTimeTableForm((prev) => ({
                                    ...prev,
                                    timeSlotId: value
                                }))
                            }
                        />
                    </div>


                    <UniversalButton label={isLoading ? "Adding" : "Add Time Table"} onClick={handleCreateTimetable} />
                </div>
            </Dialog>
        </div>
    )
}

export default TimeTableManagement