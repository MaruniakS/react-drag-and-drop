import React from "react";
import { Layout } from "antd";
import Table from "./components/Table";

import "./App.css";

const { Content } = Layout;

const App: React.FC = () => (
  <Layout style={{ height: '100vh'}}>
    <Content style={{ padding: 50 }}>
      <Table />
    </Content>
  </Layout>
);

export default App;
