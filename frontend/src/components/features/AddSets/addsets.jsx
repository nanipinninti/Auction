import { useState, useRef, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Cookies from "js-cookie";
import {useParams} from "react-router-dom"
const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AddSets() {
    const [rows, setRows] = useState([{ setNo: "", setName: "" }]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const inputRefs = useRef([]);
    const AuctionId = useParams().auction_id
    useEffect(() => {
        const fetchSets = async () => {
            try {
                const response = await fetch(`${DOMAIN}/auction-details/sets?auction_id=${AuctionId}`);
                const data = await response.json();
                if (data.success) {
                    const fetchedRows = data.sets.map(set => ({
                        setNo: set.set_no,
                        setName: set.set_name
                    }));
                    if (fetchedRows.length > 0){                        
                        setRows(fetchedRows);
                    }
                } else {
                    setShowErrorModal(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setShowErrorModal(true);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchSets();
    }, []); // Empty dependency array to run only on mount

    const addRow = () => {
        setRows([...rows, { setNo: "", setName: "" }]);
    };

    const deleteAllRows = () => {
        setRows([{ setNo: "", setName: "" }]);
        setShowDeleteModal(false);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleKeyPress = (e, index, field) => {
        if (e.key === "Enter") {
            if (field === "setNo") {
                inputRefs.current[index]?.setName?.focus();
            } else {
                addRow();
                setTimeout(() => inputRefs.current[index + 1]?.setNo?.focus(), 0);
            }
        } else if (e.key === "ArrowDown") {
            inputRefs.current[index + 1]?.[field]?.focus();
        } else if (e.key === "ArrowUp") {
            inputRefs.current[index - 1]?.[field]?.focus();
        }
    };

    const handlePaste = (e, index, field) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        try {
            const jsonData = JSON.parse(text);
            if (Array.isArray(jsonData)) {
                setRows([...rows, ...jsonData]);
                return;
            }
        } catch (_) {}
        
        const lines = text.split(/\r?\n/).map(line => line.split(/\t|\s{2,}/));
        
        if (lines.length === 0) return;
        
        const newRows = [...rows];
        lines.forEach((line, i) => {
            if (!newRows[index + i]) newRows.push({ setNo: "", setName: "" });
            newRows[index + i].setNo = line[0] || "";
            newRows[index + i].setName = line[1] || "";
        });
        setRows(newRows);
    };

    const handleJsonUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                if (Array.isArray(jsonData)) {
                    setRows([...rows, ...jsonData]);
                }
            } catch (error) {
                console.error("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const addSets = async () => {
        const setData = rows.map(row => ({
            set_no: row.setNo,
            set_name: row.setName
        }));
        
        const requestBody = {
            auction_id: AuctionId, 
            setData
        };

        try {
            const response = await fetch(`${DOMAIN}/auction/add-sets`, {
                method: 'POST',
                credentials: "include", 
                headers: { 
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                setShowErrorModal(true);
            }
        } catch (error) {
            setShowErrorModal(true);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mt-3">
            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    {/* Table Header */}
                    <div className="flex w-full">
                        <h1 className="w-1/4 ">Set No</h1>
                        <h1 className="w-3/4 ">Set Name</h1>
                    </div>

                    {/* Table Rows */}
                    {rows.map((row, index) => (
                        <div key={index} className="flex w-full gap-2 items-center">
                            <input
                                type="text"
                                value={row.setNo}
                                onChange={(e) => handleInputChange(index, "setNo", e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, index, "setNo")}
                                onPaste={(e) => handlePaste(e, index, "setNo")}
                                ref={(el) => inputRefs.current[index] = { ...inputRefs.current[index], setNo: el }}
                                className="w-1/4 p-1 px-2 border border-gray-300 rounded bg-transparent"
                                placeholder="Set No"
                            />
                            <input
                                type="text"
                                value={row.setName}
                                onChange={(e) => handleInputChange(index, "setName", e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, index, "setName")}
                                onPaste={(e) => handlePaste(e, index, "setName")}
                                ref={(el) => inputRefs.current[index] = { ...inputRefs.current[index], setName: el }}
                                className="w-3/4 p-1 px-2 border border-gray-300 rounded bg-transparent"
                                placeholder="Set Name"
                            />
                            <button
                                onClick={() => deleteRow(index)}
                                className="p-2 rounded text-red-500 text-[20px]"
                            >
                                <MdOutlineDelete/>
                            </button>
                        </div>
                    ))}

                    {/* Buttons */}
                    <div className="flex gap-2 mt-2 text-[13px]">
                        <button
                            onClick={addRow}
                            className="p-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            + Add Row
                        </button>
                        <label className="p-1 px-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
                            + Add JSON
                            <input type="file" accept="application/json" onChange={handleJsonUpload} className="hidden" />
                        </label>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                        >
                            <MdOutlineDelete className="text-[14px]"/> Delete All
                        </button>
                    </div>

                    <button
                            onClick={addSets}
                            className="p-1 px-2 w-[150px] bg-[#60A5FA] text-white rounded"
                        >
                            Add Sets
                    </button>

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                            <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                                <p className="mb-4">Are you sure you want to delete all the Sets data?</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteAllRows}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Delete All
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                            <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                                <h2 className="text-xl font-semibold mb-4">Success</h2>
                                <p className="mb-4">Data was successfully modified.</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Modal */}
                    {showErrorModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                            <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                                <h2 className="text-xl font-semibold mb-4">Error</h2>
                                <p className="mb-4">Failed to modify the data.</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowErrorModal(false)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}