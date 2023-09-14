import React, { useEffect, useState } from 'react'

import "./commandsList.scss"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';


interface CommandsListProps {
    data: any
}

const ListBody: React.FC<CommandsListProps> = ({ data }) => {
    return (
        <>
            <div className='supplier-info'>
                <div className='logo'>
                    <div className='logo-img'></div>
                    <div className="name-rate">
                        <span className='supplier-name'></span>
                        <span className='supplier-rates'></span>
                    </div>
                </div>
            </div>
            <div className='command-info'>
                <div className='logo'>
                    <div className='logo-img'></div>
                    <div className="name-rate">
                        <span className='supplier-name'></span>
                        <span className='supplier-rates'></span>
                    </div>
                </div>
            </div>
        </>

    )
}


const CommandsList: React.FC<CommandsListProps> = ({ data }) => {

    const [commands, setCommands] = useState<any>(data)

    useEffect(() => {
        setCommands(data)

    }, [data])

    return (

        <>
            <section className='commands-List' >
                {commands.map((command: any, index: number) => {
                    return (
                        <div className='command-header' key={index}>
                            <span >
                                Commande N°3567
                            </span>
                            <span >
                                {command.client.name}
                            </span>
                            <span>
                                {command.to_adresse}
                            </span>
                            <span>
                                {command.created_at}
                            </span>
                            <KeyboardArrowUpOutlinedIcon className='icon' />

                        </div>)
                })}
            </section>
        </>
    )
}

export default CommandsList