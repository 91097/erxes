import {
  ActionButtons,
  Button,
  Label,
  Table,
  Tip
} from 'modules/common/components';
import { __, confirm } from 'modules/common/utils';
import { Wrapper } from 'modules/layout/components';
import Sidebar from 'modules/settings/integrations/components/Sidebar';
import { KIND_CHOICES } from 'modules/settings/integrations/constants';
import * as React from 'react';
import { ILinkedAccount } from '../types';

type Props = {
  accounts: ILinkedAccount[];
  delink: (accountId: string) => void;
};

class List extends React.Component<Props> {
  onClick(accountId) {
    const { delink } = this.props;

    confirm().then(() => {
      delink(accountId);
    });
  }

  getTypeName(integration) {
    const kind = integration.kind;

    if (kind === KIND_CHOICES.TWITTER) {
      return 'twitter';
    }

    if (kind === KIND_CHOICES.FACEBOOK) {
      return 'facebook';
    }

    if (kind === KIND_CHOICES.FORM) {
      return 'form';
    }

    if (kind === KIND_CHOICES.GMAIL) {
      return 'gmail';
    }

    return 'default';
  }

  renderRow(account) {
    return (
      <tr key={account._id}>
        <td> {account.accountName}</td>
        <td>
          <Label className={`label-${this.getTypeName(account.kind)}`}>
            {account.kind}
          </Label>
        </td>
        <td>
          <ActionButtons>
            <Tip text={__('Delink')}>
              <Button
                btnStyle="link"
                onClick={this.onClick.bind(this, account._id)}
                icon="cancel-1"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }

  renderContent() {
    const { accounts } = this.props;

    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <th>{__('Account name')}</th>
              <th>{__('Kind')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>{accounts.map(account => this.renderRow(account))}</tbody>
        </Table>
      </React.Fragment>
    );
  }

  render() {
    const breadcrumb = [{ title: __('App store') }];

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
      />
    );
  }
}

export default List;
