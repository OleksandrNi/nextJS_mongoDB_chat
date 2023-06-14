import React, { useState, useEffect } from "react";
import Button from "../Button";
import { Container, UserEmail, UserName, Wrapper } from "./UserProfileElements";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import InputFeild from "../InputFeild/InputFeild";

import styles from "./UserProfile.module.scss";

interface UserData {
  name: string;
  surname: string;
  email: string;
  address: string;
  fullName: string;
  phone: string;
  _id: string;
  _v: string;
}

const UserProfile = () => {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  console.log("name", name);

  useEffect(() => {
    if (userData) {
      setName(userData?.name);
      setSurname(userData?.surname);
      setAddress(userData?.address);
      setPhone(userData?.phone);
    }
  }, [userData]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/auth/profile");
      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError("");
    setName(event.target.value);
  };

  const handleSurname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError("");
    setSurname(event.target.value);
  };

  const handleAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError("");
    setAddress(event.target.value);
  };

  const handlePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError("");
    setPhone(event.target.value);
  };

  const handleCreateProfile = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      const response = await axios.put(
        `${process.env.NEXTAUTH_URL}/api/auth/profile`,
        {
          name,
          surname,
          address,
          phone,
        }
      );
      await setUserData(response.data.user);
      alert("Данные успешно обновлены");
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || "Failed to update profile"
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <div>
        <InputFeild
          type="text"
          placeholder={"Name"}
          value={name}
          name="name"
          onChange={handleName}
        />
        <InputFeild
          type="text"
          placeholder={"Surname"}
          value={surname}
          name="surname"
          onChange={handleSurname}
        />
        <InputFeild
          type="text"
          placeholder={"Address"}
          value={address}
          name="address"
          onChange={handleAdress}
        />
        <InputFeild
          type="text"
          placeholder={"Phone"}
          value={phone}
          name="phone"
          onChange={handlePhone}
        />

        <Button
          onClick={handleCreateProfile}
          title={"Update profile"}
          type="button"
          disabled={loading}
        />
        {submitError && <p>{submitError}</p>}
      </div>
      <div>
        <span>{userData?.name}</span>
        <span>{userData?.surname}</span>
        <span>{userData?.email}</span>
        <span>{userData?.phone}</span>
        <span>{userData?.address}</span>
      </div>
    </div>
  );
};

export default UserProfile;
