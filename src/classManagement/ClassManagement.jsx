import React, { useState, useEffect } from 'react';
import { Dialog } from "primereact/dialog";
import toast from 'react-hot-toast';

// APIS 
import { createClass, createSection, getAllClasses, getParticularClassSection, toggleSubjectAssignment, getClassSubjects, getAllTeachers, assignTeacherToClassSection } from '@/apis/classAndsections/classAndsections';

// COMPONENTS 
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import UniversalSkeleton from "@/components/ui/UniversalSkeleton";
import UniversalTabs from "@/components/common/UniversalTabs";

const ClassManagement = () => {
  const TabItem = ({ children }) => {
    return <>{children}</>;
  };
  return (
    <UniversalTabs>

      <TabItem label="Manage Class">
        <ManageClass />
      </TabItem>

      <TabItem label="Manage Section">
        <ManageSection />
      </TabItem>

    </UniversalTabs>
  )
}

const ManageClass = () => {
  const [classes, setClasses] = useState([]);
  const [searchedClass, setSearchedClass] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sectionDetails, setSectionDetails] = useState(null);
  const [viewClassDetails, setViewClassDetails] = useState(false);
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [assignAssignmentToClass, setAssignAssignmentToClass] = useState(false);
  const [addSection, setAddSection] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    class: "",
    subject: ""
  });
  const [sectionFormDetails, setSectionFormDetails] = useState({
    teacher: "",
    nameOfSection: ""
  });

  const [formDetails, setFormDetails] = useState({
    className: "",
    numOfSection: ""
  })
  const [assignTeacher, setAssignTeacher] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchAllClasses = async () => {
    setLoading(true)
    try {
      const response = await getAllClasses()
      setClasses(response?.data?.allClass)
      setFilteredClasses(response?.data?.allClass)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllClasses()
  }, [])

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

  const handleCreateClass = async () => {
    if (!formDetails.className) {
      toast.error("Please enter class name")
      return;
    }
    if (!formDetails.numOfSection) {
      toast.error("Please enter number of sections")
      return;
    }
    setLoading(true)
    const data = {
      "name": formDetails.className,
      "noOfSections": Number(formDetails.numOfSection)
    }
    try {
      const response = await createClass(data)
      if (response?.isSuccess) {
        fetchAllClasses()
        setCreateClassDialog(false)
        setFormDetails({})
      } else {
        toast.error(res?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  // const handleAddSection = async () => {
  //   setLoading(true)
  //   const data = {
  //     name: sectionFormDetails?.nameOfSection,
  //     classId: selectedClass?.id,
  //     supervisorId: sectionFormDetails?.teacher
  //   }
  //   try {
  //     const response = await createSection(data)
  //     if (response?.isSuccess) {
  //       toast.success(response?.data.message)
  //       setAddSection(false)
  //       fetchParticularClassSection(selectedClass?.id)
  //     } else {
  //       toast.error(response?.message)
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const classOptions = classes.map((cls, i) => ({
    label: cls.name,
    value: cls.id
  }))

  const fetchClassSubjects = async () => {
    const id = assignmentForm?.class
    try {
      const response = await getClassSubjects(id)
      if (response?.isSuccess) {
        setSubjectList(response?.data?.data)
      } else {
        toast.error(res?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const subjectOptions = subjectList.map((subject, i) => ({
    label: subject?.subject.name,
    value: subject?.subject.id
  }))

  const handleAssignAssignment = async () => {
    if (!assignmentForm?.class) {
      toast.error("Please select the class")
      return;
    }

    if (!assignmentForm?.subject) {
      toast.error("Please select the subject")
      return;
    }

    setLoading(true)
    const data = {
      classId: assignmentForm?.class,
      subjectId: assignmentForm?.subject
    }
    try {
      const res = await toggleSubjectAssignment(data)
      if (res?.isSuccess) {
        toast.success(res?.data?.message)
        setAssignAssignmentToClass(false)
      } else {
        toast.error(res?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (assignmentForm?.class && assignAssignmentToClass) {
      fetchClassSubjects()
    }
  }, [assignmentForm?.class])

  const handleViewDetails = (details) => {
    setSelectedClass(details)
    setViewClassDetails(true)
    fetchParticularClassSection(details.id)
    fetchAllTeachers()
  }


  const handleSearch = () => {
    if (!searchedClass.trim()) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchedClass.toLowerCase())
    );

    setFilteredClasses(filtered);
  };

  useEffect(() => {
    handleSearch()
  }, [searchedClass])

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
      <div className='flex items-center justify-center text-2xl font-semibold'>Manage Classes</div>
      <div className='flex flex-wrap gap-4 justify-end my-4'>
        <div className='flex gap-3'>
          <InputField
            placeholder="Search class"
            value={searchedClass}
            onChange={(e) => setSearchedClass(e.target.value)}
          />
          <div><UniversalButton label={loading ? "Searching" : "Search"} onClick={fetchAllClasses} /></div>
        </div>
        <div><UniversalButton label="Create Class" onClick={() => setCreateClassDialog(true)} /></div>
        <div><UniversalButton label="Assign Assignment" onClick={() => setAssignAssignmentToClass(true)} /></div>
      </div>
      <div className="theme-container">
        {
          loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.length > 0 && filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="group card relative overflow-hidden"
                  >

                    {/* Class Name */}
                    <h2 className="card-title">
                      {highlightText(cls.name, searchedClass)}
                    </h2>

                    <p className="card-subtitle mt-1">
                      Created on{" "}
                      {new Date(cls.createdAt).toLocaleString()}
                    </p>

                    {/* Divider */}
                    <div className="card-divider" />

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <button className="card-link hover:underline" onClick={() => handleViewDetails(cls)}>
                        View
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {
                filteredClasses.length === 0 && (
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
                      Please type valid class name <br />
                      Try again
                    </p>

                  </div>
                )
              }
            </>
          )
        }

      </div>
      <Dialog
        header="View Class Details"
        visible={viewClassDetails}
        style={{ width: "57rem" }}
        onHide={() => setViewClassDetails(false)}
        draggable={false}
        contentClassName='custom-dialog'
        headerClassName='custom-dialog'
      >
        <div className="p-4">

          {/* Class Title */}
          <div className="mb-6">
            <h2 className="card-title">
              {selectedClass?.name}
            </h2>
            <div className='flex justify-between'>
              <p className="text-sm text-gray-500 mt-1">
                Total Sections: {sectionDetails?.length || 0}
              </p>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sectionDetails?.map((section) => (
              <div
                key={section.id}
                className="card"
              >
                {/* Section Name */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {section.name.charAt(0).toUpperCase()}
                  </div>

                  {section.teacher ? (
                    <span className="capsule px-2 py-1 rounded-full">
                      Assigned
                    </span>
                  ) : (
                    <span className="capsule px-2 py-1 rounded-full">
                      No Teacher
                    </span>
                  )}
                </div>

                {/* Teacher Info */}
                <div className="mt-3 text-sm text-gray-600">
                  {section.teacher
                    ? section.teacher.user.name
                    : "Teacher not assigned"}
                </div>
              </div>
            ))}
          </div>

        </div>
      </Dialog>
      <Dialog
        header="Create Class"
        visible={createClassDialog}
        style={{ width: "36rem" }}
        onHide={() => setCreateClassDialog(false)}
        draggable={false}
        contentClassName='custom-dialog'
        headerClassName='custom-dialog'
      >
        <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
          <div className='w-full'>
            <InputField
              label="Class Name"
              placeholder="Enter class name"
              tooltipContent="Write the class name"
              value={formDetails.className}
              onChange={(e) => setFormDetails((prev) => ({
                ...prev,
                className: e.target.value
              }))}
            />
          </div>
          <div className='w-full'>
            <InputField
              label="Number of sections"
              placeholder="Enter number of sections"
              tooltipContent="Write number of sections that class will have"
              value={formDetails.numOfSection}
              onChange={(e) => setFormDetails((prev) => ({
                ...prev,
                numOfSection: e.target.value
              }))}
            />
          </div>
        </div>
        <div className='flex justify-center items-center my-4'>
          <UniversalButton label={loading ? "Creating class..." : "Create Class"} onClick={handleCreateClass} disabled={loading} />
        </div>
      </Dialog>
      <Dialog
        header="Assign Assignment"
        visible={assignAssignmentToClass}
        style={{ width: "36rem" }}
        onHide={() => setAssignAssignmentToClass(false)}
        draggable={false}
        contentClassName='custom-dialog'
        headerClassName='custom-dialog'
      >
        <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
          <div className='w-full'>
            <DropdownWithSearch
              label="Select Class"
              options={classOptions}
              tooltipContent="Select class to assign assignment"
              placeholder="Select a class"
              value={assignmentForm?.class}
              onChange={(value) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  class: value,
                }))
              }
            />
          </div>
          <div className='w-full'>
            <DropdownWithSearch
              label="Select Subject"
              options={subjectOptions}
              tooltipContent="Select subject to assign assignment"
              placeholder="Select a subject"
              value={assignmentForm?.subject}
              onChange={(value) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  subject: value,
                }))
              }
            />
          </div>
        </div>
        <div className='flex justify-center items-center my-4'>
          <UniversalButton label={loading ? "Assigning" : "Assign"} onClick={handleAssignAssignment} />
        </div>
      </Dialog>

    </div>
  )
}

const ManageSection = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [teachersList, setTeachersList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [addSection, setAddSection] = useState(false);
  const [sectionFormDetails, setSectionFormDetails] = useState({
    teacher: "",
    nameOfSection: ""
  });

  useEffect(() => {
    if (!selectedClass) {
      setSectionList([])
    }
  }, [selectedClass])

  const [assignTeacher, setAssignTeacher] = useState(false)
  const [assignFormDetails, setAssignFormDetails] = useState({
    teacher: "",
    section: ""
  })
  const [loading, setLoading] = useState(false)

  const fetchAllClasses = async () => {
    setLoading(true)
    try {
      const response = await getAllClasses()
      setClasses(response?.data?.allClass)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllClasses()
  }, [])

  const fetchParticularClassSection = async () => {
    const classId = selectedClass
    try {
      const response = await getParticularClassSection(classId)
      if (response?.isSuccess) {
        setSectionList(response?.data?.sections)
      } else {
        toast.error(res?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchParticularClassSection()
  }, [selectedClass])

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

  useEffect(() => {
    fetchAllTeachers()
  }, [addSection])

  const teachersOptions = teachersList?.map((teacher, index) => ({
    label: teacher?.user?.name,
    value: teacher.id
  }))

  const sectionOptions = sectionList.map((sec, i) => ({
    label: sec.name,
    value: sec.id
  }))

  const handleAddSection = async () => {

    if (!sectionFormDetails?.teacher) {
      toast.error("Please select teacher")
      return;
    }
    if (!sectionFormDetails?.nameOfSection) {
      toast.error("Please fill name of section")
      return;
    }
    if (!selectedClass) {
      toast.error("Please select the class")
      return;
    }

    setLoading(true)
    const data = {
      name: sectionFormDetails?.nameOfSection,
      classId: selectedClass,
      supervisorId: sectionFormDetails?.teacher
    }
    try {
      const response = await createSection(data)
      if (response?.isSuccess) {
        toast.success(response?.data.message)
        setAddSection(false)
        fetchParticularClassSection()
      } else {
        toast.error(res?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  const classOptions = classes.map((cls, i) => ({
    label: cls.name,
    value: cls.id
  }))

  const handleAssignTeacher = async () => {
    if (!assignFormDetails.section) {
      toast.error("Section must be selected")
      return;
    }

    if (!assignFormDetails.teacher) {
      toast.error("Teacher must be selected")
      return;
    }
    const data = {
      sectionId: assignFormDetails.section,
      teacherId: assignFormDetails.teacher
    }
    try {
      const res = await assignTeacherToClassSection(data)
    } catch (error) {
      console.error("error", error)
      toast.error(error?.message)
    }
  }

  return (
    <div>
      <div className='flex items-center justify-center text-2xl font-semibold'>Manage Section</div>
      <div className='flex flex-col md:flex-row md:flex-wrap gap-4 justify-end my-4'>
        <div className='flex md:flex-row flex-col gap-3'>

          <div className='w-full md:w-56'>
            <DropdownWithSearch
              placeholder="Select class"
              options={classOptions}
              value={selectedClass}
              onChange={(value) => setSelectedClass(value)}
            />
          </div>

          <div className='w-full md:w-auto'>
            <UniversalButton
              label="Search"
              onClick={fetchParticularClassSection}
              className="w-full md:w-auto"
            />
          </div>

        </div>

        <div className='w-full md:w-auto'>
          <UniversalButton
            label="Add Section"
            onClick={() => setAddSection(true)}
            disabled={!selectedClass}
            className="w-full md:w-auto"
          />
        </div>

        <div className='w-full md:w-auto'>
          <UniversalButton
            label="Assign Teacher"
            onClick={() => setAssignTeacher(true)}
            disabled={!selectedClass}
            className="w-full md:w-auto"
          />
        </div>
      </div>
      <div className="p-6 theme-container">
        {
          !selectedClass && (
            <div className="flex justify-center items-center h-[40rem]">
              <div className="empty-state-card text-center">
                <div className="empty-icon mb-4">
                  📖
                </div>

                <h2 className="text-2xl font-semibold mb-2">
                  No Class Selected
                </h2>

                <p className="text-[var(--muted-text)]">
                  Please select a class and click search to view the class sections.
                </p>
              </div>
            </div>
          )}
        {
          loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {sectionList?.map((section) => (
                <div
                  key={section.id}
                  className="card"
                >
                  {/* Section Name */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
                      {section.name?.charAt(0).toUpperCase()}
                    </div>

                    {section.teacher ? (
                      <span className="capsule px-2 py-1 rounded-full">
                        Assigned
                      </span>
                    ) : (
                      <span className="capsule px-2 py-1 rounded-full">
                        No Teacher
                      </span>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="mt-3 text-sm text-gray-600">
                    {section.teacher
                      ? section.teacher.user.name
                      : "Teacher not assigned"}
                  </div>
                </div>
              ))}
            </div>
          )
        }

      </div>

      <Dialog
        header="Add Section"
        visible={addSection}
        style={{ width: "57rem" }}
        onHide={() => setAddSection(false)}
        draggable={false}
        contentClassName='custom-dialog'
        headerClassName='custom-dialog'
      >
        <div className='flex flex-col md:flex-row gap-2'>
          <DropdownWithSearch
            label="Select Supervisor"
            options={teachersOptions}
            tooltipContent="Select the class teacher you want to assign new section"
            value={sectionFormDetails?.teacher}
            onChange={(value) =>
              setSectionFormDetails((prev) => ({
                ...prev,
                teacher: value,
              }))
            }
          />

          <InputField
            label="Section Name"
            placeholder="Type section name"
            tooltipContent="Write new section name"
            value={sectionFormDetails?.nameOfSection}
            onChange={(e) =>
              setSectionFormDetails((prev) => ({
                ...prev,
                nameOfSection: e.target.value,
              }))
            }
          />
        </div>
        <div className='flex items-center justify-center mt-5'>
          <UniversalButton label={loading ? "Saving" : "Save"} onClick={handleAddSection} disabled={loading} />
        </div>
      </Dialog>
      <Dialog
        header="Assign Teacher"
        visible={assignTeacher}
        style={{ width: "57rem" }}
        onHide={() => setAssignTeacher(false)}
        draggable={false}
        contentClassName='custom-dialog'
        headerClassName='custom-dialog'
      >
        <div className='flex flex-col md:flex-row gap-2'>
          <DropdownWithSearch
            label="Select Supervisor"
            options={teachersOptions}
            tooltipContent="Select the class teacher you want to assign a section"
            value={assignFormDetails?.teacher}
            onChange={(value) =>
              setAssignFormDetails((prev) => ({
                ...prev,
                teacher: value,
              }))
            }
          />

          <DropdownWithSearch
            label="Select Section"
            options={sectionOptions}
            tooltipContent="Select the section"
            value={assignFormDetails?.section}
            onChange={(value) =>
              setAssignFormDetails((prev) => ({
                ...prev,
                section: value,
              }))
            }
          />
        </div>
        <div className='flex items-center justify-center mt-5'>
          <UniversalButton label={loading ? "Saving" : "Save"} onClick={handleAssignTeacher} disabled={loading} />
        </div>
      </Dialog>
    </div>
  )
}



export default ClassManagement