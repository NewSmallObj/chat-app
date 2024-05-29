import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { Nunito } from "next/font/google";
// import '../../public/antd.min.css';
import './globals.css';
import SessionContext from "./providers/SessionContext";


export const metadata: Metadata = {
	title: 'Loong4-front',
	description: 'SSR nextjs',
} 

const font = Nunito({
  subsets: ['latin'],
})


export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={font.className}>
        <AntdRegistry>
          <ConfigProvider theme={{ 
            token:{
              colorPrimary: '#531dab', //#531dab 0ea5e9
              colorLink:"#531dab"
            },
            // components:{
            //   Button: {
            //     colorPrimary: '#0ea5e9',
            //   },
            // }
          }}>
            <SessionContext>
                {children}
            </SessionContext>
          </ConfigProvider>
        </AntdRegistry>
      </body>
		</html>
	)
}
