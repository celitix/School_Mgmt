import React, { useEffect, useState } from 'react';
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { IoMdTrash } from "react-icons/io";
import toast from 'react-hot-toast';

// APIS
import { createAcademicYear, getAllAcademicYear, updateAcademicYear, deleteAcademicYear } from "@/apis/academicYear/academicYear"

// COMPONENTS 
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import UniversalSkeleton from "@/components/ui/UniversalSkeleton"

const AcademicYearManagement = () => {
    const [academicForm, setAcademicForm] = useState({
        fromDate: "",
        toDate: ""
    })
    const [addAcademicYearOpen, setAddAcademicYearOpen] = useState(false)
    const [allAcademicYear, setAllAcademicYear] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState()
    const [editAcademicYear, setEditAcademicYear] = useState(false)
    const [deleteAcademicYearOpen, setDeleteAcademicYearOpen] = useState(false)
    const [searchedYear, setSearchedYear] = useState("")
    const [filteredAcademicYear, setFilteredAcademicYear] = useState([])
    const [editAcademicYearForm, setEditAcademicYearFrom] = useState({
        fromDate: "",
        toDate: ""
    })

    useEffect(() => {
        if (editAcademicYear && selectedYear) {
            setEditAcademicYearFrom({
                fromDate: selectedYear.fromYear
                    ? new Date(Number(selectedYear.fromYear), 0)
                    : null,
                toDate: selectedYear.toYear
                    ? new Date(Number(selectedYear.toYear), 0)
                    : null,
            });
        }
    }, [editAcademicYear, selectedYear]);

    const fetchAllAcademicYears = async () => {
        setIsLoading(true)
        try {
            const res = await getAllAcademicYear()
            if (res?.isSuccess) {
                setAllAcademicYear(res?.data?.academicYears)
                setFilteredAcademicYear(res?.data?.academicYears)
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
        fetchAllAcademicYears()
    }, [])

    const handleCreateAcademicYear = async () => {
        if (!academicForm.fromDate || !academicForm.toDate) {
            toast.error("Please select both years");
            return;
        }

        const fromYear = academicForm.fromDate.getFullYear();
        const toYear = academicForm.toDate.getFullYear();

        if (toYear <= fromYear) {
            toast.error("To Year must be greater than From Year");
            return;
        }
        const data = {
            fromYear: fromYear.toString(),
            toYear: toYear.toString(),
        };
        try {
            const res = await createAcademicYear(data)
            if (res?.isSuccess) {
                toast.success(res.data.message)
                setAddAcademicYearOpen(false)
                setAcademicForm({})
                fetchAllAcademicYears()
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleUpdateAcademicYear = async () => {
        if (!editAcademicYearForm.fromDate || !editAcademicYearForm.toDate) {
            toast.error("Please select both years");
            return;
        }

        const fromYear = editAcademicYearForm.fromDate.getFullYear();
        const toYear = editAcademicYearForm.toDate.getFullYear();

        if (toYear <= fromYear) {
            toast.error("To Year must be greater than From Year");
            return;
        }
        const data = {
            fromYear: fromYear.toString(),
            toYear: toYear.toString(),
        };

        const yearId = selectedYear.id;

        try {
            const res = await updateAcademicYear(data, yearId);
            if (res?.isSuccess) {
                setEditAcademicYear(false);
                fetchAllAcademicYears()
            } else {
                toast.error(res?.error?.message)
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleDeleteAcademicYear = async (id) => {
        const yearId = id
        try {
            const res = await deleteAcademicYear(yearId)
            if (res?.isSuccess) {
                toast.success("Academic year deleted successfully!!")
                setDeleteAcademicYearOpen(false)
                fetchAllAcademicYears()
            } else {
                toast.error(res?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleViewAcademicYear = (data) => {
        setEditAcademicYear(true)
        setSelectedYear(data)
    }

    const handleAcademicYearDelete = (data) => {
        setDeleteAcademicYearOpen(true)
        setSelectedYear(data)
    }


    const handleSearch = () => {
        if (!searchedYear.trim()) {
            setFilteredAcademicYear(allAcademicYear);
            return;
        }

        const filtered = allAcademicYear.filter((year) =>
            year.toYear.toLowerCase().includes(searchedYear.toLowerCase()) ||
            year.fromYear.toLowerCase().includes(searchedYear.toLowerCase())
        );

        setFilteredAcademicYear(filtered);
    };

    useEffect(() => {
        handleSearch()
    }, [searchedYear])

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
            <div className='flex items-center justify-center text-2xl font-semibold'>Academic Year Management</div>
            <div className='flex md:flex-row flex-col gap-4 justify-end my-4'>
                <div className='flex md:flex-row flex-col gap-2'>
                    <InputField
                        placeholder="Search Year"
                        value={searchedYear}
                        onChange={(e) => setSearchedYear(e.target.value)}
                    />
                    <UniversalButton label="Search" onClick={fetchAllAcademicYears} /></div>
               <UniversalButton label="Create Academic Year" onClick={() => setAddAcademicYearOpen(true)} />
            </div>
            <div className="p-6 theme-container">
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
                            {filteredAcademicYear?.map((year) => (
                                <div
                                    key={year.id}
                                    className="card group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Main Title */}
                                    <div>
                                        <h2 className="card-title">
                                            Academic Year
                                        </h2>

                                        <p className="card-subtitle">
                                            Session {highlightText(year.fromYear, searchedYear)} – {highlightText(year.toYear, searchedYear)}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 text-xs text-gray-400">
                                        Created on{" "}
                                        {new Date(year.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className='absolute right-2 top-2 text-xl text-gray-600 cursor-pointer' onClick={() => handleAcademicYearDelete(year)}>
                                        <IoMdTrash />
                                    </div>

                                    <div className="card-divider" />

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        <button className="card-link hover:underline" onClick={() => handleViewAcademicYear(year)}>
                                            Edit
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )
                }

                {
                    filteredAcademicYear.length === 0 && (
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
                header="Create Academic Year"
                visible={addAcademicYearOpen}
                style={{ width: "48rem" }}
                onHide={() => setAddAcademicYearOpen(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Select From Year:</label>
                            <Calendar
                                value={academicForm.fromDate}
                                onChange={(e) =>
                                    setAcademicForm((prev) => ({
                                        ...prev,
                                        fromDate: e.value,
                                    }))
                                }
                                view="year"
                                dateFormat="yy"
                                placeholder="Choose From Year"
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Select To Year:</label>
                            <Calendar
                                value={academicForm.toDate}
                                onChange={(e) =>
                                    setAcademicForm((prev) => ({
                                        ...prev,
                                        toDate: e.value,
                                    }))
                                }
                                view="year"
                                minDate={
                                    academicForm.fromDate
                                        ? new Date(
                                            academicForm.fromDate.getFullYear() + 1,
                                            0,
                                            1
                                        )
                                        : null
                                }
                                dateFormat="yy"
                                placeholder="Choose To Year"
                                className="w-full"
                            />
                        </div>

                    </div>
                    <div className='flex items-center justify-center my-4'>
                        <UniversalButton label="Create Academic Year" onClick={handleCreateAcademicYear} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Edit Academic Year"
                visible={editAcademicYear}
                style={{ width: "48rem" }}
                onHide={() => setEditAcademicYear(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Select From Year:</label>
                            <Calendar
                                value={editAcademicYearForm.fromDate}
                                onChange={(e) =>
                                    setEditAcademicYearFrom((prev) => ({
                                        ...prev,
                                        fromDate: e.value,
                                    }))
                                }
                                view="year"
                                dateFormat="yy"
                                placeholder="Choose From Year"
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Select To Year:</label>
                            <Calendar
                                value={editAcademicYearForm.toDate}
                                onChange={(e) =>
                                    setEditAcademicYearFrom((prev) => ({
                                        ...prev,
                                        toDate: e.value,
                                    }))
                                }
                                view="year"
                                dateFormat="yy"
                                placeholder="Choose To Year"
                                className="w-full"
                            />
                        </div>

                    </div>
                    <div className='flex items-center justify-center my-4'>
                        <UniversalButton label="Update Academic Year" onClick={handleUpdateAcademicYear} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Delete Academic Year"
                visible={deleteAcademicYearOpen}
                style={{ width: "48rem" }}
                onHide={() => setDeleteAcademicYearOpen(false)}
                draggable={false}
                contentClassName='custom-dialog'
                headerClassName='custom-dialog'
            >
                <div className='flex flex-col justify-center items-center gap-5'>
                    <h2>Are you sure uou want to <span className='text-red-500'>delete</span> this Academic Year ?</h2>
                    <div className='flex gap-2'>
                        <UniversalButton label="Delete" variant="danger" onClick={() => handleDeleteAcademicYear(selectedYear.id)} />
                        <UniversalButton label="Cancel" variant="black" onClick={() => setDeleteAcademicYearOpen(false)} />
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default AcademicYearManagement