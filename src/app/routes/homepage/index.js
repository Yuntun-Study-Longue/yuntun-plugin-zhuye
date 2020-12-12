import React from "react";
import Page from "../../components/page";

export default () => (
  <Page
    id="homepage"
    title="Homepage"
    description="This is about really cool stuff."
  >
    <p>Here's yuntun plugin demo. You are welcome.</p>
    <img
      src={'logo.jpg'}
      alt="Homepage"
      style={{ width: "400px" }}
    />
  </Page>
);
