import React, { useState, useEffect } from 'react';
import { Dialog } from "primereact/dialog";
import toast from 'react-hot-toast';

// ICONS 
import { RxCross2 } from "react-icons/rx";
import { IoMdTrash } from "react-icons/io";

// APIS 
import { createSubjects, getSubjects, getSubjectsClass, updateSubject, deleteSubject, assignSubjectToClass } from "@/apis/subjects/subjects"
import { getAllClasses } from "@/apis/classAndsections/classAndsections"

// COMPONENTS 
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import UniversalSkeleton from "@/components/ui/UniversalSkeleton";
import UniversalTabs from "@/components/common/UniversalTabs";

const SubjectManagement = () => {
    const TabItem = ({ children }) => {
        return <>{children}</>;
    };
    return (
        <div>
            {/* <div className='flex items-center justify-center text-2xl font-semibold'>Subject Management</div> */}
            <UniversalTabs>

                <TabItem label="Subjects">
                    <ManageSubject />
                </TabItem>

                <TabItem label="Assign Subject">
                    <AssignSubject />
                </TabItem>

            </UniversalTabs>
        </div>
    )
}

const ManageSubject = () => {
    const [subjectList, setSubjectList] = useState([]);
    const [openAddSubject, setOpenAddSubject] = useState(false);
    const [subjectName, setSubjectName] = useState("");
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [editSubjectDialog, setEditSubjectDialog] = useState(false)
    const [editedName, setEditedName] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [searchedSubject, setSearchedSubject] = useState("")
    const [filteredSubjectList, setFilteredSubjectList] = useState([])


    const fetchSubjectList = async () => {
        setIsLoading(true)
        try {
            const res = await getSubjects();
            if (res?.isSuccess) {
                setSubjectList(res?.data?.data)
                setFilteredSubjectList(res?.data?.data)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSubjectList()
    }, [])


    const handleAddSubject = async () => {
        setIsLoading(true)
        if (!subjectName) {
            toast.error("Please enter the subject name")
            return;
        }
        const data = {
            name: subjectName
        }
        try {
            const res = await createSubjects(data)
            if (res?.isSuccess) {
                toast.success(res?.data?.message)
                setOpenAddSubject(false)
                fetchSubjectList()
                setSubjectName("")
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateSubject = async () => {
        const id = editSubjectId;
        const data = {
            name: editedName
        }
        try {
            const res = await updateSubject(id, data)
            if (res?.isSuccess) {
                toast.success("Subject updated successfully!!")
                fetchSubjectList()
                setEditSubjectDialog(false)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleDelete = async (deleteId) => {
        const id = deleteId
        try {
            const res = await deleteSubject(id)
            if (res?.isSuccess) {
                toast.success(res?.data?.message)
                fetchSubjectList()
                setOpenDeleteDialog(false)
                setSelectedSubject("")
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleSearch = () => {
        if (!searchedSubject.trim()) {
            setFilteredSubjectList(subjectList);
            return;
        }

        const filtered = subjectList.filter((sub) =>
            sub.name.toLowerCase().includes(searchedSubject.toLowerCase())
        );

        setFilteredSubjectList(filtered);
    };

    useEffect(() => {
        handleSearch()
    }, [searchedSubject])

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
            <div className='flex items-center justify-center text-2xl font-semibold'>Subject Management</div>
            <div className='flex flex-wrap justify-end gap-2 my-4'>
                <div className='flex gap-2'>
                    <InputField
                        placeholder="Search Subject"
                        value={searchedSubject}
                        onChange={(e) => setSearchedSubject(e.target.value)}
                    />
                    <div><UniversalButton label="Search" onClick={fetchSubjectList} /></div>
                </div>
                <div><UniversalButton label="Add Subject" onClick={() => setOpenAddSubject(true)} /></div>
            </div>
            <div className='theme-container'>
                {
                    isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        <UniversalSkeleton
                            height="220px"
                            count={3}
                            className="rounded-2xl mb-3"
                        />

                        <UniversalSkeleton
                            height="220px"
                            count={3}
                            className="rounded-2xl mb-3"
                        />
                        <UniversalSkeleton
                            height="220px"
                            count={3}
                            className="rounded-2xl mb-3"
                        />
                    </div> : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSubjectList?.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="group card cursor-pointer relative overflow-hidden"
                                >

                                    {/* Subject Name */}
                                    <h2
                                        className="mt-2 card-title"
                                        onClick={() => {
                                            setEditSubjectId(sub.id);
                                            setEditedName(sub.name);
                                        }}
                                    >
                                        {highlightText(sub.name, searchedSubject)}
                                    </h2>


                                    <p className="card-subtitle mt-1">
                                        Created on{" "}
                                        {new Date(sub.createdAt).toLocaleString()}
                                    </p>

                                    {/* Divider */}
                                    <div className="card-divider" />

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        {/* <button className="text-sm font-medium text-indigo-600 hover:underline" onClick={() => handleViewDetails(cls)}>
                                        View
                                    </button> */}
                                        <button
                                            className="text-sm font-medium text-indigo-600 hover:underline"
                                            onClick={() => {
                                                setEditedName(sub.name)
                                                setEditSubjectDialog(true)
                                                setEditSubjectId(sub.id);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className='absolute right-2 top-2 text-xl text-gray-600 cursor-pointer' onClick={() => {
                                        setOpenDeleteDialog(true)
                                        setSelectedSubject(sub.id)
                                    }}>
                                        <IoMdTrash />
                                    </div>

                                </div>
                            ))}

                        </div>
                    )
                }

                {
                    filteredSubjectList.length === 0 && (
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
                                Please type subject <br />
                                Try again
                            </p>

                        </div>
                    )
                }
            </div>

            <Dialog
                header="Add Subject"
                visible={openAddSubject}
                style={{ width: "36rem" }}
                onHide={() => setOpenAddSubject(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex justify-center'>
                    <div className='w-full md:w-56'>
                        <InputField
                            label="Enter subject name"
                            placeholder="Enter subject name"
                            value={subjectName}
                            tooltipContent="Enter the subject you want to add"
                            onChange={(e) => setSubjectName(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex justify-center my-4'>
                    <UniversalButton label={isLoading ? "Saving" : "Save"} onClick={handleAddSubject} />
                </div>
            </Dialog>
            <Dialog
                header="Delete Dialog"
                visible={openDeleteDialog}
                style={{ width: "36rem" }}
                onHide={() => setOpenDeleteDialog(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col justify-center items-center gap-5'>
                    <h2>Are you sure uou want to <span className='text-red-500'>delete</span> this subject ?</h2>
                    <div className='flex gap-2'>
                        <UniversalButton label="Delete" variant="danger" onClick={() => handleDelete(selectedSubject)} />
                        <UniversalButton label="Cancel" variant="black" onClick={() => setOpenDeleteDialog(false)} />
                    </div>
                </div>
            </Dialog>
            <Dialog
                header="Edit Subject"
                visible={editSubjectDialog}
                style={{ width: "36rem" }}
                onHide={() => setEditSubjectDialog(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className="flex items-center gap-2 mt-5">
                    <InputField
                        label="Edit Subject name"
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                    />
                </div>
                <div className='flex justify-center items-center mt-6'>
                    <UniversalButton label="Save" onClick={handleUpdateSubject} />
                </div>
            </Dialog>

        </div>
    )
}

const AssignSubject = () => {
    const [subjectList, setSubjectList] = useState([]);
    const [classSubjectList, setClassSubjectList] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [editSubjectDialog, setEditSubjectDialog] = useState(false)
    const [classes, setClasses] = useState([]);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [assignSubject, setAssignSubject] = useState(false);
    const [assignForm, setAssignForm] = useState({
        class: "",
        subject: ""
    });
    const [isLoading, setIsLoading] = useState(false)

    const fetchAllClasses = async () => {
        try {
            const response = await getAllClasses()
            if (response.isSuccess) {
                setClasses(response?.data?.allClass)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchAllClasses()
    }, [])

    const fetchSubjectList = async () => {
        setIsLoading(true)
        try {
            const res = await getSubjects();
            if (res?.isSuccess) {
                setSubjectList(res?.data?.data)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSubjectList()
    }, [])

    const classOptions = classes.map((cls, i) => ({
        label: cls.name,
        value: cls.id
    }))

    const fetchClassAllSubjects = async () => {
        console.log("here")
        const classId = selectedClass
        if (!selectedClass) {
            return;
        }
        try {
            const res = await getSubjectsClass(classId)
            if (res.isSuccess) {
                setClassSubjectList(res.data.data);
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        if (selectedClass) {

            fetchClassAllSubjects()
        }
    }, [selectedClass])

    const handleUpdateSubject = async () => {
        const id = editSubjectId;
        const data = {
            name: editedName
        }
        try {
            const res = await updateSubject(id, data)
            if (res?.isSuccess) {
                toast.success("Subject updated successfully!!")
                fetchClassAllSubjects()
                setEditSubjectDialog(false)
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleDelete = async (deleteId) => {
        const id = deleteId
        try {
            const res = await deleteSubject(id)
            if (res?.isSuccess) {
                toast.success(res?.data?.message)
                fetchClassAllSubjects()
                setOpenDeleteDialog(false)
                setSelectedSubject("")
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }

    const subjectOptions = subjectList?.map((sub, i) => ({
        label: sub.name,
        value: sub.id
    }))

    const handleAssignSubjectToClass = async () => {
        setIsLoading(true)
        if (!assignForm?.subject) {
            toast.error("Please select subject")
        }
        if (!assignForm?.class) {
            toast.error("Please select class")
        }

        try {
            const res = await assignSubjectToClass(assignForm?.subject, assignForm?.class)
            if (res?.isSuccess) {
                toast.success(res?.data?.message)
                setAssignSubject(false)
                fetchClassAllSubjects()
                setAssignForm({})
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <div className='flex items-center justify-center text-2xl font-semibold'>Assign Subject</div>
            <div className='flex flex-col md:flex-row md:flex-wrap justify-end gap-2 my-4'>

                <div className='w-full md:w-56'>
                    <DropdownWithSearch
                        options={classOptions}
                        value={selectedClass}
                        onChange={(value) => setSelectedClass(value)}
                    />
                </div>

                <div className='w-full md:w-auto'>
                    <UniversalButton
                        label={isLoading ? "Searching" : "Search"}
                        onClick={fetchClassAllSubjects}
                        className="w-full md:w-auto"
                    />
                </div>

                <div className='w-full md:w-auto'>
                    <UniversalButton
                        label="Assign Subject"
                        onClick={() => setAssignSubject(true)}
                        disabled={!selectedClass}
                        className="w-full md:w-auto"
                    />
                </div>

            </div>
            <div className='theme-container'>
                {
                    !selectedClass ? (
                        <div className="flex justify-center items-center h-[40rem]">
                            <div className="empty-state-card text-center">
                                <div className="empty-icon mb-4">
                                    📖
                                </div>

                                <h2 className="text-2xl font-semibold mb-2">
                                    No Class Selected
                                </h2>

                                <p className="text-[var(--muted-text)]">
                                    Please select a class to view the subjects.
                                </p>
                            </div>
                        </div>

                    ) : isLoading ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            <UniversalSkeleton
                                height="220px"
                                count={3}
                                className="rounded-2xl mb-3"
                            />

                            <UniversalSkeleton
                                height="220px"
                                count={3}
                                className="rounded-2xl mb-3"
                            />
                            <UniversalSkeleton
                                height="220px"
                                count={3}
                                className="rounded-2xl mb-3"
                            />
                        </div>

                    ) : selectedClass && classSubjectList.length === 0 ? (
                        <div className="h-[40rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">

                            {/* Large Faded Background Text */}
                            <h1 className="absolute md:text-[120px] text-[60px] font-bold text-gray-100 select-none pointer-events-none">
                                EMPTY
                            </h1>

                            {/* Message */}
                            <h2 className="text-2xl font-semibold text-gray-800 z-10">
                                No Data Available
                            </h2>

                            <p className="text-gray-500 mt-2 z-10 max-w-sm text-center">
                                This class has no subjects assigned <br />
                                Select another class
                            </p>

                        </div>

                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classSubjectList.length > 0 &&
                                classSubjectList.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="group card relative overflow-hidden"
                                    >
                                        {/* Class Name */}
                                        <h2
                                            className="card-title transition cursor-pointer"
                                        >
                                            {sub.subject.name}
                                        </h2>
                                    </div>
                                ))}
                        </div>

                    )
                }

            </div>

            <Dialog
                header="Delete Dialog"
                visible={openDeleteDialog}
                style={{ width: "36rem" }}
                onHide={() => setOpenDeleteDialog(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col justify-center items-center gap-5'>
                    <h2>Are you sure uou want to <span className='text-red-500'>delete</span> this subject ?</h2>
                    <div className='flex gap-2'>
                        <UniversalButton label="Delete" variant="danger" onClick={() => handleDelete(selectedSubject)} />
                        <UniversalButton label="Cancel" variant="black" onClick={() => setOpenDeleteDialog(false)} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Assign Subject"
                visible={assignSubject}
                style={{ width: "36rem" }}
                onHide={() => setAssignSubject(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col md:flex-row gap-2'>
                    <DropdownWithSearch
                        label="Select Subject"
                        options={subjectOptions}
                        placeholder="Select the subject"
                        value={assignForm.subject}
                        tooltipContent="Select subject you want to assign"
                        onChange={(value) =>
                            setAssignForm((prev) => ({
                                ...prev,
                                subject: value
                            }))
                        }
                    />
                    <DropdownWithSearch
                        label="Select Class"
                        options={classOptions}
                        placeholder="Select the class"
                        value={assignForm.class}
                        tooltipContent="Select the class"
                        onChange={(value) =>
                            setAssignForm((prev) => ({
                                ...prev,
                                class: value
                            }))
                        }
                    />
                </div>
                <div className='flex items-center justify-center mt-5'>
                    <UniversalButton
                        label={isLoading ? "Assigning" : "Assign"}
                        onClick={handleAssignSubjectToClass}
                    />
                </div>
            </Dialog>

            <Dialog
                header="Edit Subject"
                visible={editSubjectDialog}
                style={{ width: "36rem" }}
                onHide={() => setEditSubjectDialog(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className="flex items-center gap-2 mt-5">
                    <InputField
                        label="Edit Subject name"
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                    />
                </div>
                <div className='flex justify-center items-center mt-6'>
                    <UniversalButton label="Save" onClick={handleUpdateSubject} />
                </div>
            </Dialog>
        </div>
    )
}
export default SubjectManagement