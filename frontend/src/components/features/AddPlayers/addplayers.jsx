import { useState, useRef, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AddPlayers() {
    const [rows, setRows] = useState([{ 
        name: "", img: "",setNo:"", age: "", basePrice: "", country: "", type: "", 
        matchesPlayed: "", runs: "", avg: "", strikeRate: "", fifties: "", 
        hundreds: "", wickets: "", bowlingAvg: "", threeWicketHaul: "", stumpings: "" 
    }]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const inputRefs = useRef([]);
    const { auction_id } = useParams(); // Get auction_id from URL

    // Fetch saved players from API
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`${DOMAIN}/players/all?auction_id=${auction_id}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("customer_token")}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    const fetchedRows = data.players.map(player => ({
                        name: player.player_name,
                        img: player.image_url,
                        setNo : player.set_no,
                        age: player.age,
                        basePrice: player.base_price,
                        country: player.country,
                        type: player.Type,
                        matchesPlayed: player.stats.matches_played,
                        runs: player.stats.runs,
                        avg: player.stats.avg,
                        strikeRate: player.stats.strike_rate,
                        fifties: player.stats.fifties,
                        hundreds: player.stats.hundreds,
                        wickets: player.stats.wickets,
                        bowlingAvg: player.stats.bowling_avg,
                        threeWicketHaul: player.stats.three_wicket_haul,
                        stumpings: player.stats.stumpings
                    }));
                    if (fetchedRows.length > 0) {
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

        fetchPlayers();
    }, [auction_id]); // Fetch data when auction_id changes

    const addRow = () => {
        setRows([...rows, { 
            name: "", img: "", setNo : "",age: "", basePrice: "", country: "", type: "", 
            matchesPlayed: "", runs: "", avg: "", strikeRate: "", fifties: "", 
            hundreds: "", wickets: "", bowlingAvg: "", threeWicketHaul: "", stumpings: "" 
        }]);
    };

    const deleteAllRows = () => {
        setRows([{ 
            name: "", img: "", setNo : "",age: "", basePrice: "", country: "", type: "", 
            matchesPlayed: "", runs: "", avg: "", strikeRate: "", fifties: "", 
            hundreds: "", wickets: "", bowlingAvg: "", threeWicketHaul: "", stumpings: "" 
        }]);
        setShowDeleteModal(false);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleKeyPress = (e, index, field) => {
        if (e.key === "Enter") {
            const nextField = getNextField(field);
            if (nextField) {
                inputRefs.current[index]?.[nextField]?.focus();
            } else {
                addRow();
                setTimeout(() => inputRefs.current[index + 1]?.name?.focus(), 0);
            }
        } else if (e.key === "ArrowDown") {
            inputRefs.current[index + 1]?.[field]?.focus();
        } else if (e.key === "ArrowUp") {
            inputRefs.current[index - 1]?.[field]?.focus();
        }
    };

    const getNextField = (currentField) => {
        const fields = [
            "name", "img", "setNo","age", "basePrice", "country", "type", 
            "matchesPlayed", "runs", "avg", "strikeRate", "fifties", 
            "hundreds", "wickets", "bowlingAvg", "threeWicketHaul", "stumpings"
        ];
        const currentIndex = fields.indexOf(currentField);
        return fields[currentIndex + 1];
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
            if (!newRows[index + i]) newRows.push({ 
                name: "", img: "",setNo: "", age: "", basePrice: "", country: "", type: "", 
                matchesPlayed: "", runs: "", avg: "", strikeRate: "", fifties: "", 
                hundreds: "", wickets: "", bowlingAvg: "", threeWicketHaul: "", stumpings: "" 
            });
            newRows[index + i].name = line[0] || "";
            newRows[index + i].img = line[1] || "";                   
            newRows[index + i].setNo = line[2] || "";
            newRows[index + i].age = line[3] || "";     
            newRows[index + i].basePrice = line[4] || "";
            newRows[index + i].country = line[5] || "";
            newRows[index + i].type = line[6] || "";
            newRows[index + i].matchesPlayed = line[7] || "";
            newRows[index + i].runs = line[8] || "";
            newRows[index + i].avg = line[9] || "";
            newRows[index + i].strikeRate = line[10] || "";
            newRows[index + i].fifties = line[11] || "";
            newRows[index + i].hundreds = line[12] || "";
            newRows[index + i].wickets = line[13] || "";
            newRows[index + i].bowlingAvg = line[14] || "";
            newRows[index + i].threeWicketHaul = line[15] || "";
            newRows[index + i].stumpings = line[16] || "";
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

    const addPlayers = async () => {
        const playerData = rows.map(row => ({
            player_name: row.name,
            image_url: row.img,
            age: row.age,
            set_no: row.setNo,
            base_price: row.basePrice,
            country: row.country,
            Type: row.type,
            stats: {
                matches_played: row.matchesPlayed,
                runs: row.runs,
                avg: row.avg,
                strike_rate: row.strikeRate,
                fifties: row.fifties,
                hundreds: row.hundreds,
                wickets: row.wickets,
                bowling_avg: row.bowlingAvg,
                three_wicket_haul: row.threeWicketHaul,
                stumpings: row.stumpings
            }
        }));
        
        const requestBody = {
            auction_id: auction_id, 
            players: playerData
        };

        try {
            const response = await fetch(`http://localhost:5001/players/add`, {
                method: 'POST',
                credentials: "include", 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("customer_token")}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
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
        <div className="flex flex-col gap-4 w-full sm:w-5/6 mt-3 overflow-x-scroll">
            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    {/* Table Header */}
                    <div className="flex w-full gap-2">
                        {[
                            "Name", "Img", "Set No", "Age", "Base Price", "Country", "Type", 
                            "Matches Played", "Runs", "Avg", "Strike Rate", "Fifties", 
                            "Hundreds", "Wickets", "Bowling Avg", "3W Haul", "Stumpings"
                        ].map((header, idx) => (
                            <h1 key={idx} className="min-w-[200px] max-w-[200px] m-0 p-1 px-2">
                                {header}
                            </h1>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {rows.map((row, index) => (
                        <div key={index} className="flex w-full gap-2 items-center">
                            {Object.keys(row).map((field, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={row[field]}
                                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, index, field)}
                                    onPaste={(e) => handlePaste(e, index, field)}
                                    ref={(el) => inputRefs.current[index] = { ...inputRefs.current[index], [field]: el }}
                                    className="w-[200px] min-w-[200px] max-w-[200px] p-1 px-2 border border-gray-300 rounded bg-transparent overflow-hidden whitespace-nowrap text-ellipsis"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                />
                            ))}
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
                            onClick={addPlayers}
                            className="p-1 px-2 w-[150px] bg-[#60A5FA] text-white rounded"
                        >
                            Add Players
                    </button>

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                            <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                                <p className="mb-4">Are you sure you want to delete all the Players data?</p>
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