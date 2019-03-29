import React, { Component } from 'react';
import Nav from '../../../components/nav';
import FormattedCurrency, { CURRENCY_COLOR } from '../../../components/formattedCurrency';

import { Table, Icon, Dialog } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { formatTimeStampToYYYYMMDD, wealthUtils } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import exceed from 'utils/apimap';
import * as actions from '../actions';

class WealthRecordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteRecordDialogVisible: false,
      deletingRecordId: -1,
    };
  }

  componentDidMount() {
    this.props.fetchWealthRecordArray();
    this.props.fetchWealthCategoryArray();
  }

  deleteRecord = (id) => {
    exceed.fetch({
      api: 'deleteWealthRecord',
      params: {
        id,
      },
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    const { wealthRecordArray, wealthCategoryOrderArray, wealthCategoryFlatArray } = this.props;
    const { deleteRecordDialogVisible, deletingRecordId } = this.state;

    return (
      <div>
        <Nav />
        <div className="page-wealth-record-list-wrap">
          <Table
            maxBodyHeight={window.innerHeight - 100}
            dataSource={wealthRecordArray}
            fixedHeader
          >
            <Table.Column
              lock
              title=""
              align="center"
              width={80}
              cell={(value, index, record) => {
                return (
                  <div>
                    <Icon
                      onClick={() => {
                        this.setState({
                          deleteRecordDialogVisible: true,
                          deletingRecordId: record.id,
                        });
                      }}
                      style={{ marginRight: 12 }}
                      size="small"
                      type="ashbin"
                    />
                    <Icon
                      onClick={() => {
                        this.props.history.push(`/wealth/record/${record.id}`);
                      }}
                      size="small"
                      type="edit"
                    />
                  </div>
                );
              }}
            />
            <Table.Column
              lock
              title="日期"
              align="center"
              width={100}
              cell={(value, index, record) => {
                return <div>{formatTimeStampToYYYYMMDD(new Date(record.date))}</div>;
              }}
            />
            <Table.Column
              lock
              title="净资产"
              align="center"
              width={100}
              cell={(value, index, record) => {
                return (<FormattedCurrency
                  color={CURRENCY_COLOR.WEALTH}
                  value={wealthUtils.sumAsset(record, wealthCategoryFlatArray, wealthUtils.SUM_TYPE.NET_ASSET)}
                />);
              }}
            />
            {wealthCategoryOrderArray.map((category) => {
              const allRecordItems = [];
              wealthRecordArray.forEach(singleWealthRecord => {
                allRecordItems.push(...singleWealthRecord.wealthRecordItems);
              });
              if (allRecordItems.filter(recordItem => recordItem.categoryId === category.id).length === 0) {
                return null;
              }
              return (<Table.Column
                title={category.name}
                align="center"
                width={100}
                cell={(value, index, record) => {
                  const relativeRecordItem = record.wealthRecordItems
                    .filter(item => item.categoryId === category.id);
                  if (relativeRecordItem.length > 0 &&
                    parseFloat(relativeRecordItem[0].value) > 0
                  ) {
                    return (<FormattedCurrency
                      value={parseFloat(relativeRecordItem[0].value)}
                      color={CURRENCY_COLOR.WEALTH}
                    />);
                  }
                  return <div />;
                }}
              />);
            })}
          </Table>
        </div>
        <Dialog
          visible={deleteRecordDialogVisible}
          onOk={() => {
            this.deleteRecord(deletingRecordId);
            this.setState({ deleteRecordDialogVisible: false });
          }}
          onCancel={() => { this.setState({ deleteRecordDialogVisible: false }); }}
          size="normal"
          onClose={() => { this.setState({ deleteRecordDialogVisible: false }); }}
          title="确认删除记录"
        >
          <div>确认删除该条记录？</div>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(WealthRecordList));
