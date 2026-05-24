import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const AllUsers = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
        const res = await axiosSecure.get('/users');
        console.log("all users", res.data)
        return res.data ;
    }
});

console.log(users);


    // 🔥 Role Change
    const handleRoleChange = async (userId, newRole, name) => {

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Make ${name} → ${newRole}?`,
            icon: "warning",
            showCancelButton: true
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.patch(`/users/${userId}`, { role: newRole });

        if (res.data.modifiedCount) {
            refetch();
            Swal.fire("Success", "User role updated", "success");
        }
    };

    return (
        <div className='w-11/12 mx-auto py-14'>

            <h2 className='text-3xl font-bold my-8'>
                All Users: {users.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table">

                    <thead>
                        <tr>
                            <th>No</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        { Array.isArray(users) && 
                            users.map((u, i) => (

                                <tr key={u._id}>

                                    <td>{i + 1}</td>

                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={u.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="font-bold">
                                                    {u.displayName}
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Current Role */}
                                    <td>
                                        <span className={`px-2 py-1 rounded text-white 
                                            ${u.role === 'admin' && 'bg-green-500'}
                                            ${u.role === 'manager' && 'bg-yellow-500'}
                                            ${u.role === 'user' && 'bg-blue-500'}
                                        `}>
                                            {u.role}
                                        </span>
                                    </td>

                                    {/* 🔥 Select Role */}
                                    <td>

                                        <select
                                            className="select select-bordered"
                                            value={u.role}
                                            disabled={u.email === user?.email}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    u._id,
                                                    e.target.value,
                                                    u.displayName
                                                )
                                            }
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                        </select>

                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AllUsers;
