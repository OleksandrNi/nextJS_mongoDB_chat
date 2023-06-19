import React from "react";
import Head from "next/head";
import UserProfile from "../components/Profile";

type Props = {};

const profile = (props: Props) => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <UserProfile />
    </>
  );
};

export default profile;
