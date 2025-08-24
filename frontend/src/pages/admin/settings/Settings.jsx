import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore.js";

const Settings = () => {
  const {
    authUser,
    fetchCurrentAdmin,
    updateAccount,
    updating,
    changePassword,
    changingPassword,
  } = useAuthStore();

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  // Password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  // Load current admin
  useEffect(() => {
    const init = async () => {
      if (!authUser) {
        const res = await fetchCurrentAdmin();
        if (res?.ok) {
          setName(res.data?.name || "");
          setEmail(res.data?.email || "");
        }
      } else {
        setName(authUser.name || "");
        setEmail(authUser.email || "");
      }
    };
    init();
  }, [authUser, fetchCurrentAdmin]);

  const validateEmail = (val) => /\S+@\S+\.\S+/.test(val);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");

    if (!name.trim()) return setProfileErr("Name is required.");
    if (!validateEmail(email))
      return setProfileErr("Enter a valid email address.");

    const res = await updateAccount({ name: name.trim(), email: email.trim() });
    if (res?.ok) {
      setProfileMsg("Profile updated successfully.");
      setTimeout(() => setProfileMsg(""), 2500);
    } else {
      setProfileErr(res?.message || "Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");

    if (newPwd.length < 8)
      return setPwdErr("New password must be at least 8 characters.");
    if (newPwd === currentPwd)
      return setPwdErr("New password must be different from current password.");
    if (newPwd !== confirmPwd) return setPwdErr("New passwords do not match.");

    const res = await changePassword({
      oldPassword: currentPwd,
      newPassword: newPwd,
    });
    if (res?.ok) {
      setPwdMsg("Password updated successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdMsg(""), 2500);
    } else {
      setPwdErr(res?.message || "Password change failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Manage your admin account details.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Update your display name and email.
        </p>

        <form
          onSubmit={handleSaveProfile}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-1">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Your name"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <div className="text-sm">
              {profileErr && (
                <span className="text-rose-700">{profileErr}</span>
              )}
              {profileMsg && (
                <span className="text-emerald-700">{profileMsg}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {updating ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Use a strong password with at least 8 characters.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-1">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="currentPwd"
            >
              Current Password
            </label>
            <div className="mt-1 relative">
              <input
                id="currentPwd"
                name="currentPwd"
                type={show.current ? "text" : "password"}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Current password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                aria-label="Toggle current password visibility"
              >
                {show.current ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="sm:col-span-1">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="newPwd"
            >
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="newPwd"
                name="newPwd"
                type={show.next ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="New password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                aria-label="Toggle new password visibility"
              >
                {show.next ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="sm:col-span-1">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="confirmPwd"
            >
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPwd"
                name="confirmPwd"
                type={show.confirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                aria-label="Toggle confirm password visibility"
              >
                {show.confirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <div className="text-sm">
              {pwdErr && <span className="text-rose-700">{pwdErr}</span>}
              {pwdMsg && <span className="text-emerald-700">{pwdMsg}</span>}
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Settings;
