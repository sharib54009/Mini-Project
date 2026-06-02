import React, { useEffect, useState } from "react";
import { User, Sparkles, LogOut, Save } from "lucide-react";

const skinTypes = ["dry", "oily", "combination", "normal", "sensitive"];

const skinConcerns = [
  "acne",
  "pigmentation",
  "dark_spots",
  "dryness",
  "oiliness",
  "dull_skin",
  "blackheads",
  "sensitive_skin",
];

const Profile = () => {
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",

    age: "",

    gender: "",

    skinType: "",

    skinProblems: [],
  });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/profile/${userId}`);

        const data = await res.json();

        if (res.ok) {
          setProfile({
            name: "",
            age: "",
            gender: "",
            skinType: "",
            skinProblems: [],
            ...data,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setProfile({
      ...profile,

      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // TOGGLE CONCERNS
  // =========================

  const toggleConcern = (concern) => {
    const currentConcerns = profile.skinProblems || [];
    const exists = currentConcerns.includes(concern);

    if (exists) {
      setProfile({
        ...profile,

        skinProblems: currentConcerns.filter((item) => item !== concern),
      });
    } else {
      setProfile({
        ...profile,

        skinProblems: [...currentConcerns, concern],
      });
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch("http://127.0.0.1:5000/profile/update", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: userId,

          ...profile,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("userId");

    window.location.href = "/";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* HEADER */}

      <div className="px-5 pt-10">
        <h1 className="app-page-title">Profile</h1>

        <p className="app-page-subtitle">
          Manage your skincare profile
        </p>
      </div>

      {/* USER CARD */}

      <div className="px-5 mt-8">
        <div className="app-card p-6">
          <div
            className="
              w-20
              h-20
              rounded-full
              bg-pink-100
              flex
              items-center
              justify-center
              mx-auto
            "
          >
            <User size={40} className="text-pink-500" />
          </div>

          <h1 className="text-xl font-semibold text-center mt-4">{profile.name}</h1>
        </div>
      </div>

      {/* PERSONAL INFO */}

      <div className="px-5 mt-8">
        <div className="app-card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <User size={20} className="text-pink-500" />

            <h1 className="font-semibold">Personal Info</h1>
          </div>

          {/* NAME */}

          <div>
            <p
              className="
                text-sm
                text-gray-500
                mb-2
              "
            >
              Name
            </p>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="app-input"
            />
          </div>

          {/* AGE */}

          <div>
            <p
              className="
                text-sm
                text-gray-500
                mb-2
              "
            >
              Age
            </p>

            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="app-input"
            />
          </div>

          {/* GENDER */}

          <div>
            <p
              className="
                text-sm
                text-gray-500
                mb-2
              "
            >
              Gender
            </p>

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="app-input"
            >
              <option value="">Select Gender</option>

              <option value="male">Male</option>

              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* SKIN PROFILE */}

      <div className="px-5 mt-8">
        <div className="app-card p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-pink-500" />

            <h1 className="font-semibold">Skin Profile</h1>
          </div>

          {/* SKIN TYPE */}

          <div className="mt-5">
            <p
              className="
                text-sm
                text-gray-500
                mb-3
              "
            >
              Skin Type
            </p>

            <div className="flex flex-wrap gap-3">
              {skinTypes.map((type, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setProfile({
                      ...profile,
                      skinType: type,
                    })
                  }
                  type="button"
                  className={`app-pill ${profile.skinType === type ? "app-pill-selected" : "bg-[var(--surface-soft)]"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* CONCERNS */}

          <div className="mt-7">
            <p
              className="
                text-sm
                text-gray-500
                mb-3
              "
            >
              Skin Concerns
            </p>

            <div className="flex flex-wrap gap-3">
              {skinConcerns.map((concern, idx) => {
                const isSelected = (profile.skinProblems || []).includes(concern);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`app-pill ${isSelected ? "app-pill-selected" : "bg-[var(--surface-soft)]"}`}>
                    {concern.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS */}

      <div className="px-5 mt-10 space-y-4">
        {/* SAVE */}

        <button onClick={saveProfile} disabled={saving} className="app-button app-button-primary w-full py-4">
          <Save size={20} />
          <span className="ml-2">{saving ? "Saving..." : "Save Changes"}</span>
        </button>

        {/* LOGOUT */}

        <button onClick={handleLogout} className="app-button app-button-ghost w-full py-4 text-red-500">
          <LogOut size={20} />
          <span className="ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
