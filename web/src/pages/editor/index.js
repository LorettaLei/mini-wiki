import React, { Component } from "react";
import { PageHeader, Button, Modal, message } from "antd";
import MDForm from "./MDForm";
import "./style.styl";
import action from "./action";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import { connect } from "react-redux";

class Editor extends Component {
  mdEditor = null
  state = {
    mdParser: new MarkdownIt(),
    MOCK_DATA:
      "# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n___\n---\n***\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\ntest.. test... test..... test?..... test!....\n!!!!!! ???? ,,  -- ---\n\"Smartypants, double quotes\" and 'single quotes'\n**This is bold text**\n__This is bold text__\n*This is italic text*\n_This is italic text_\n~~Strikethrough~~\n> Blockquotes test\n - nest\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa",
    dialogShow: false
  };
  submit = values => {
    let { userInfo } = this.props;
    let md = this.mdEditor.getMdValue();
    action
      .createMD({
        title: values.title,
        parent: values.nav ? JSON.stringify(values.nav.split(",")) : "[]",
        content: md,
        user: userInfo._id
      })
      .then(d => {
        if (d.status === 200) {
          message.success("操作成功");
          this.setState({
            dialogShow: false,
            MOCK_DATA: ""
          });
        } else {
          message.error(d.msg);
        }
      });
  };
  render() {
    return (
      <div className="editor">
        <PageHeader
          ghost={false}
          title="创作"
          extra={[
            <Button
              type="primary"
              key="add"
              onClick={() => {
                this.setState({ dialogShow: true });
              }}
            >
              发布
            </Button>
          ]}
        ></PageHeader>
        <div style={{ height: "calc(100% - 128px)" }}>
          <MdEditor ref={node => this.mdEditor = node}
            value={this.state.MOCK_DATA}
            renderHTML={text => this.state.mdParser.render(text)}
          />
        </div>
        <Modal
          title="新建"
          visible={this.state.dialogShow}
          onCancel={() => {
            this.setState({ dialogShow: false });
          }}
          footer={""}
        >
          <MDForm submit={this.submit} />
        </Modal>
      </div>
    );
  }
}
const stateData = (state, myProps) => ({
  userInfo: state.userInfo
});
export default connect(stateData)(Editor);
