import fs from 'fs';
import React from 'react';
import { extractStyle } from '@ant-design/static-style-extract';
import { ConfigProvider } from 'antd';

const outputPath = './public/antd.min.css';

const testGreenColor = '#b37feb';
const testRedColor = '#ff0000';

const css = extractStyle((node) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: testGreenColor,
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: testRedColor,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
));

fs.writeFileSync(outputPath, css);