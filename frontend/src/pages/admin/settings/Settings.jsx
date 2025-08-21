import React, { useEffect, useState } from "react";

const ADMIN_PROFILE_KEY = "adminProfile";
const ADMIN_PASSWORD_KEY = "adminPassword";

const loadProfile = () => {
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object") return data;
  } catch {}
  return { name: "Administrator", email: "admin@example.com" };
};

const saveProfile = (profile) => {
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
};

const loadPassword = () => localStorage.getItem(ADMIN_PASSWORD_KEY) || "";

const savePassword = (pwd) => localStorage.setItem(ADMIN_PASSWORD_KEY, pwd);

const Settings = () => {
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    const profile = loadProfile();
    setName(profile.name || "");
    setEmail(profile.email || "");
    // Initialize a default password if none exists (optional)
    if (!loadPassword()) savePassword("admin@123");
  }, []);

  const validateEmail = (val) => /\S+@\S+\.\S+/.test(val);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    if (!name.trim()) return setProfileMsg("Name is required.");
    if (!validateEmail(email))
      return setProfileMsg("Enter a valid email address.");

    try {
      setSavingProfile(true);
      // Simulate latency
      await new Promise((r) => setTimeout(r, 400));
      saveProfile({ name: name.trim(), email: email.trim() });
      setProfileMsg("Profile updated successfully.");
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(""), 2500);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    const stored = loadPassword();

    if (stored && currentPwd !== stored) {
      return setPwdMsg("Current password is incorrect.");
    }
    if (newPwd.length < 8) {
      return setPwdMsg("New password must be at least 8 characters.");
    }
    if (newPwd === currentPwd) {
      return setPwdMsg("New password must be different from current password.");
    }
    if (newPwd !== confirmPwd) {
      return setPwdMsg("New passwords do not match.");
    }

    try {
      setSavingPwd(true);
      await new Promise((r) => setTimeout(r, 400));
      savePassword(newPwd);
      setPwdMsg("Password updated successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } finally {
      setSavingPwd(false);
      setTimeout(() => setPwdMsg(""), 2500);
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
              {profileMsg && (
                <span className="text-emerald-700">{profileMsg}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
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
              {pwdMsg && <span className="text-emerald-700">{pwdMsg}</span>}
            </div>
            <button
              type="submit"
              disabled={savingPwd}
              className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
            >
              {savingPwd ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Settings;
