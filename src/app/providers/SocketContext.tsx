'use client'
import { useSession } from 'next-auth/react'
import {
	createContext,
	useState,
	useEffect,
	useContext,
	SetStateAction,
} from 'react'
import io from 'socket.io-client'
import { BASEURL } from '../action/stants'

const SocketContext = createContext({ socket: null, onlineUsers: [] })

export const useSocketContext = () => {
	return useContext(SocketContext)
}

interface SocketContextProps {
	children: React.ReactNode
}

export const SocketContextProvider = ({ children }: SocketContextProps) => {
	const [socket, setSocket] = useState<any>(null)
	const [onlineUsers, setOnlineUsers] = useState([])
	const session = useSession()

	useEffect(() => {
		if (session?.data?.user?.userId) {
			const socket_on = io(BASEURL, {
				query: {
					userId: session.data?.user?.userId,
				},
			})
			setSocket(socket_on)

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket_on.on('getOnlineUsers', (users: SetStateAction<never[]>) => {
				console.log('在线用户', users, session?.data?.user?.userId)
				setOnlineUsers(users)
			})

			return () => {
				console.log('断线', socket_on)
				socket_on && socket_on.disconnect()
			}
		}
		//  else {
		// 	if (socket) {
		// 		socket.close();
		// 		setSocket(null);
		// 	}
		// }
	}, [session])

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	)
}
