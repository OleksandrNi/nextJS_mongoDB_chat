import React from "react";
import Head from "next/head";
import Messages from "../../components/Messages";

type Props = {};

const messages = (props: Props) => {
  return (
    <>
      <Head>
        <title>Messages page</title>
      </Head>
      <Messages />
    </>
  );
};

export default messages;