import React, { useEffect } from 'react';
import { Table, Button, Grid } from '@alife/aisc';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Nav from '../../../components/nav';

import * as actions from '../actions/index';


// import { datePlus } from 'utils';
const { Row, Col } = Grid;


function FundDashboard(props) {
  useEffect(() => {
    props.getFundByTransaction();
  }, []);

  useEffect(() => {
    console.log('props.existedFund eeee', props.existedFund);
  }, [props.existedFund]);

  const { existedFund } = props;
  console.log('existedFund', existedFund);
  return (
    <div>
      <Nav />
      <div className="page-fund-dashboard">
        <Row type="wrap" >
          <Col span="24">
            <Button
              type="primary"
              onClick={() => {
                props.history.push('/fund/purchase');
              }}
            >
                记录申购
            </Button>
          </Col>
        </Row>
        <Row type="wrap" >
          <Col span="24">
            <Table
              maxBodyHeight={window.innerHeight - 100}
              dataSource={existedFund}
              fixedHeader
            >
              <Table.Column
                title="基金代码"
                align="left"
                width={80}
                dataIndex="identifier"
              />
              <Table.Column
                title="基金名称"
                align="left"
                width={150}
                cell={(value, index, record) => {
                  return (
                    <Link to={`/fund/${record.identifier}`}>
                      <span className="fund-type">{record.type}</span>
                      <span className="fund-name">{record.name}</span>
                    </Link>);
                }}
              />
              <Table.Column
                title="总净值"
                align="center"
                width={80}
                cell={() => {
                  return (
                    <div>
                      -
                    </div>
                  );
                }}
              />
              <Table.Column
                title="持仓收益"
                align="center"
                width={80}
                cell={() => {
                  return (
                    <div>
                        -
                    </div>
                  );
                }}
              />
              <Table.Column
                title="持仓收益率"
                align="center"
                width={80}
                cell={() => {
                  return (
                    <div>
                        -
                    </div>
                  );
                }}
              />
              <Table.Column
                title="持仓年化收益率"
                align="center"
                width={80}
                cell={() => {
                  return (
                    <div>
                        -
                    </div>
                  );
                }}
              />
              <Table.Column
                title="更新日期"
                align="center"
                width={80}
                cell={() => {
                  return (
                    <div>
                      -
                    </div>
                  );
                }}
              />
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(FundDashboard));
