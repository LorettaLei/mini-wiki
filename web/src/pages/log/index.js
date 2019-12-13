import React from "react";
import { PageHeader, Table, message } from "antd";
import "./style.styl";
import action from "./action";
import tool from "../../utils/tool";

class User extends React.Component {
  state = {
    dialogShow: false,
    tableData: [],
    pager: {}
  };
  UNSAFE_componentWillMount() {
    this.getTableData(1);
  }
  getTableData = pageNo => {
    action
      .getUser({
        pageNo: pageNo || this.state.pager.pageNo || 1,
        pageSize: 10,
        user: ""
      })
      .then(d => {
        if (d.status === 200) {
          let pager = { ...this.state.pager };
          pager.total = d.total;
          let tableData = d.result.map(ele => {
            let obj = ele;
            obj["key"] = ele._id;
            return obj;
          });
          this.setState({
            tableData: tableData,
            pager: pager
          });
        } else {
          message.error("数据获取失败");
        }
      });
  };
  jump = pagination => {
    let pager = { ...this.state.pager };
    pager.pageNo = pagination.current;
    this.setState({
      pager: pager
    });
    this.getTableData(pager.pageNo);
  };
  render() {
    const { tableData } = this.state;
    const columns = [
      {
        title: "用户名",
        dataIndex: "username",
        render: (text, row) => {
          return <span>{row._user && row._user.username?row._user.username:row.user}</span>;
        }
      },
      {
        title: "操作",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "创建时间",
        dataIndex: "created",
        render: (text, row) => {
          return <span>{tool.timestampToDateTime(row.created)}</span>;
        }
      }
    ];
    return (
      <div className="user">
        <PageHeader ghost={false} title="操作日志">
          <Table
            size="small"
            rowKey="_id"
            dataSource={tableData}
            columns={columns}
            pagination={this.state.pager}
            onChange={this.jump}
          />
        </PageHeader>
      </div>
    );
  }
}
export default User;
