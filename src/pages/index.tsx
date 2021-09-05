

import * as React from 'react';

import BG from '../../static/images/login/background-dark.jpg';

export interface ContainerProps {}

export default (props: ContainerProps): React.ReactElement => {
  return (
    <div id="root" {...props}>
      Container
      <img src={BG} alt="my-png" />
    </div>
  )
}
