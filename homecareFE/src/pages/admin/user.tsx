import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, Trash2, Lock, Unlock, MoreVertical } from "lucide-react";
import { adminApi } from "@/lib/api";
import { AdminHeader } from "@/components/layouts/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

interface UserInfo {
    id: number;
    fullName?: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
}

const Users = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);

    // Add User Dialog State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // Delete User Dialog State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        phone: "",
        role: "Family",
        fullName: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        try {
            if (!newUser.email) {
                toast.error("Email is required");
                return;
            }
            // Generate fullName fallback based on email
            const payload = {
                ...newUser,
                fullName: newUser.fullName || newUser.email.split('@')[0]
            };
            await adminApi.createUser(payload);
            toast.success("User created successfully");
            setIsAddDialogOpen(false);
            setNewUser({ email: "", password: "", phone: "", role: "Family", fullName: "" });
            fetchUsers();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to create user";
            toast.error(errorMsg);
        }
    };

    const handleToggleStatus = async (user: UserInfo) => {
        try {
            setTogglingUserId(user.id);
            await adminApi.toggleUserStatus(user.id, !user.isActive);
            toast.success(`User ${user.isActive ? "blocked" : "unblocked"} successfully`);
            await fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update user status");
        } finally {
            setTogglingUserId(null);
        }
    };

    const handleDeleteUser = (userId: number) => {
        setUserToDeleteId(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDeleteId) return;
        try {
            await adminApi.deleteUser(userToDeleteId);
            toast.success("User deleted successfully");
            setIsDeleteDialogOpen(false);
            setUserToDeleteId(null);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    const roleDisplay = (role?: string) => {
        if (!role) return "N/A";
        const r = role.toString().toLowerCase();
        if (r === "operationadmin") return "Operation Admin";
        return r.charAt(0).toUpperCase() + r.slice(1);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone || "").includes(searchTerm);

        const matchesRole = roleFilter === "all" || (user.role || "").toLowerCase() === roleFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "blocked" && !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminHeader breadcrumb="User Management" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, phone..."
                                className="pl-9 bg-white border-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="operationadmin">Op Admin</SelectItem>
                                    <SelectItem value="caregiver">Caregiver</SelectItem>
                                    <SelectItem value="family">Family</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-[#0d8ca5] hover:bg-[#0d8ca5]/90 text-white rounded-2xl h-11 px-6 shadow-sm cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Add User
                    </Button>
                </div>

                <div className="bg-white rounded-[2rem] border border-stone-150 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-stone-150">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 justify-center">
                                                <div className="w-6 h-6 border-2 border-[#0d8ca5] border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-stone-500">Loading users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-stone-550">
                                            <p className="text-sm">No users found matching your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-stone-900">{user.fullName || user.email?.split('@')[0] || "N/A"}</span>
                                                    <span className="text-xs text-gray-500">ID: #{user.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm text-stone-850 font-medium">{user.email}</span>
                                                    <span className="text-xs text-stone-450">{user.phone || "No phone"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                                                    {roleDisplay(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                                            user.isActive
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : "bg-rose-50 text-rose-700 border-rose-200"
                                                        )}
                                                    >
                                                        {user.isActive ? "Active" : "Blocked"}
                                                    </span>
                                                    {togglingUserId === user.id && (
                                                        <div className="w-3.5 h-3.5 border-2 border-[#0d8ca5] border-t-transparent rounded-full animate-spin" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-stone-100 rounded-xl"
                                                        onClick={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const spaceLeft = rect.left;
                                                            if (spaceLeft > 220) {
                                                                // Open to the left of the button
                                                                setDropdownCoords({
                                                                    top: rect.top - 8,
                                                                    left: rect.left - 200
                                                                });
                                                            } else {
                                                                // Open below the button
                                                                setDropdownCoords({
                                                                    top: rect.bottom + 8,
                                                                    left: Math.max(8, rect.right - 192)
                                                                });
                                                            }
                                                            setActiveDropdownId(activeDropdownId === user.id ? null : user.id);
                                                        }}
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-stone-500" />
                                                    </Button>
                                                    {activeDropdownId === user.id && dropdownCoords && createPortal(
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => {
                                                                setActiveDropdownId(null);
                                                                setDropdownCoords(null);
                                                            }} />
                                                            <div
                                                                className="fixed w-48 rounded-2xl bg-white border border-stone-150 shadow-xl z-50 py-1.5 animate-in fade-in duration-100"
                                                                style={{
                                                                    top: `${dropdownCoords.top}px`,
                                                                    left: `${dropdownCoords.left}px`
                                                                }}
                                                            >
                                                                <button
                                                                    disabled={togglingUserId === user.id}
                                                                    onClick={() => {
                                                                        handleToggleStatus(user);
                                                                        setActiveDropdownId(null);
                                                                        setDropdownCoords(null);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-stone-55 transition-colors cursor-pointer disabled:opacity-50",
                                                                        user.isActive ? "text-amber-600" : "text-emerald-600"
                                                                    )}
                                                                >
                                                                    {togglingUserId === user.id ? (
                                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                    ) : user.isActive ? (
                                                                        <Lock className="w-4 h-4" />
                                                                    ) : (
                                                                        <Unlock className="w-4 h-4" />
                                                                    )}
                                                                    {user.isActive ? "Block User" : "Unblock User"}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDeleteUser(user.id);
                                                                        setActiveDropdownId(null);
                                                                        setDropdownCoords(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-stone-55 text-rose-600 transition-colors cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete User
                                                                </button>
                                                            </div>
                                                        </>,
                                                        document.body
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} className="max-w-[425px]">
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-stone-900">Add New User</DialogTitle>
                        <DialogDescription className="text-sm text-stone-500">
                            Create a new user account. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Full Name</label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Nguyen Van A"
                                value={newUser.fullName}
                                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Email Address</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Phone Number</label>
                            <Input
                                id="phone"
                                placeholder="0912345678"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">User Role</label>
                            <Select
                                value={newUser.role}
                                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                                <SelectTrigger className="bg-stone-50 border-stone-200">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="OperationAdmin">Operation Admin</SelectItem>
                                    <SelectItem value="Caregiver">Caregiver</SelectItem>
                                    <SelectItem value="Family">Family</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4 pt-4 border-t border-stone-100">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border border-stone-250 hover:bg-stone-50 cursor-pointer">Cancel</Button>
                        <Button onClick={handleAddUser} className="bg-[#0d8ca5] hover:bg-[#0d8ca5]/90 text-white rounded-xl cursor-pointer">Create User</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} className="max-w-[400px]">
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-stone-900">Delete User</DialogTitle>
                        <DialogDescription className="text-sm text-stone-500 mt-2">
                            Are you sure you want to delete this user? This action cannot be undone and will permanently remove their profile.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 pt-4 border-t border-stone-100">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setUserToDeleteId(null);
                            }}
                            className="rounded-xl border border-stone-250 hover:bg-stone-55 cursor-pointer text-stone-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteUser}
                            className="bg-rose-600 hover:bg-rose-750 text-white rounded-xl cursor-pointer"
                        >
                            Delete User
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Users;
