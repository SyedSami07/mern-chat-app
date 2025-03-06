import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);

	// Fetch all users when component mounts
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/users"); // Fetch all users
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setUsers(data); // Store users
			} catch (error) {
				toast.error("Failed to load users!");
			}
		};
		fetchUsers();
	}, []);

	// Filter users based on search input
	useEffect(() => {
		if (search.length < 3) {
			setFilteredUsers([]); // Clear suggestions if input is less than 3 characters
			return;
		}

		const results = users.filter((user) =>
			user.fullName.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredUsers(results);
	}, [search, users]);

	const handleSelectUser = (user) => {
		setSelectedConversation(user);
		setSearch(""); // Clear search
		setFilteredUsers([]); // Hide suggestions
	};

	return (
		<div className='relative w-full'>
			{/* Search Bar */}
			<input
				type='text'
				placeholder='Search users...'
				className='input input-bordered rounded-full w-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
				<IoSearchSharp className='w-6 h-6' />
			</button>

			{/* Suggestions Dropdown */}
			{filteredUsers.length > 0 && search.length >= 3 && (
				<ul className='absolute w-full bg-white border rounded-md shadow-md mt-2 max-h-40 overflow-auto'>
					{filteredUsers.map((user) => (
						<li
							key={user._id}
							className='p-2 hover:bg-gray-100 cursor-pointer'
							onClick={() => handleSelectUser(user)}
						>
							{user.fullName}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchInput;
