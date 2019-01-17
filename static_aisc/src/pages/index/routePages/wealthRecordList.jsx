import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Table } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
// import exceed from 'utils/apimap';

class Wealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // flatCategory: [],
      // treeCategory: [],
    };
  }

  componentDidMount() {
  }

  render() {
    // const { treeCategory } = this.state;
    return (
      <div>
        <Nav />
        <div className="page-wealth-record-list-wrap">
          <Table
            maxBodyHeight={340}
            dataSource={[]}
            fixedHeader
          >
            <Table.Column lock title="日期" width={200} dataIndex="name" />
            <Table.Column lock title="" width={200} />
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(Wealth);
