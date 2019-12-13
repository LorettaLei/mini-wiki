import React from "react";
import { Layout, PageHeader, Button, message, Popconfirm } from "antd";
import "./style.styl";
import action from "./action";
import MenuBar from "./menuBar";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import { connect } from "react-redux";

const { Sider, Content } = Layout;
class Home extends React.Component {
  state = {
    mdParser: new MarkdownIt(),
    MOCK_DATA: "",
    path: ""
  };
  getMD = path => {
    action.getMD({ path: JSON.stringify(path) }).then(d => {
      if (d.status === 200) {
        this.setState({
          MOCK_DATA: d.result,
          path: path
        });
      } else {
        message.error(d.msg);
      }
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      MOCK_DATA: text
    });
  };
  submit = () => {
    let { userInfo } = this.props;
    if (!this.state.path) {
      message.error("请先选择一篇文章进行修改");
      return;
    }
    action
      .updateMD({
        path: JSON.stringify(this.state.path),
        content: this.state.MOCK_DATA,
        user: userInfo._id
      })
      .then(d => {
        if (d.status === 200) {
          message.success("操作成功");
        } else {
          message.error(d.msg);
        }
      });
  };
  delete = () => {
    if (!this.state.path) {
      message.error("请先选择一篇文章进行删除");
      return;
    }
    let { userInfo } = this.props;
    action
      .deleteMD({ path: JSON.stringify(this.state.path), user: userInfo._id })
      .then(d => {
        if (d.status === 200) {
          this.$MenuBar.getMenu();
          message.success("操作成功");
          this.setState({
            path: "",
            MOCK_DATA: ""
          });
        } else {
          message.error("操作失败");
        }
      });
  };
  render() {
    return (
      <Layout className="home">
        <Sider theme="light" className="home__sider">
          <MenuBar getMD={this.getMD} requestSidebar={(menubar) => { this.$MenuBar = menubar}} />
        </Sider>
        <Content className="home__main">
          <div className="home__main--editor">
            <PageHeader
              ghost={false}
              title="查看"
              extra={[
                <Popconfirm
                  title="确定永久删除这篇文章吗？"
                  key="del"
                  onConfirm={this.delete}
                >
                  <Button type="danger">删除</Button>,
                </Popconfirm>,
                <Button type="primary" key="add" onClick={this.submit}>
                  更新
                </Button>
              ]}
            ></PageHeader>
            <div style={{ height: "calc(100% - 128px)" }}>
              <MdEditor
                value={this.state.MOCK_DATA}
                onChange={this.handleEditorChange}
                renderHTML={text => this.state.mdParser.render(text)}
              />
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}
const stateData = (state, myprops) => ({
  userInfo: state.userInfo
});
export default connect(stateData)(Home);
