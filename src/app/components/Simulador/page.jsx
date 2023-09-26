'use client'
import { useEffect, useState } from 'react'
import styles from './Simulador.module.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], weight: ['500', '700', '900'] })

export default function Simulador() {

    const [variaveis, setVariaveis] = useState({
        rendimento: 0, selic: 0, investimento: 0,
        tempo: 1, cdi: 1.3,
    })

    //Buscar a taxa selic antes
    useEffect(() => {
        const BancoCentral = async () => {
            const fetchid = `1178`
            const dataInicial = `01/01/2023`
            const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${fetchid}/dados?formato=json&dataInicial=${dataInicial}`
            const dataAtual = new Date()
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            const dataFormatada = `${mes}/${ano}`
            const fetchData = await fetch(url)
            const response = await fetchData.json()

            for (let i = 0; i < response.length; i++) {
                response[i].data.includes(`${dataFormatada}`) ?
                    setVariaveis({ ...variaveis, selic: response[i].valor })
                    : ''
            }
        }
        BancoCentral()
    }, [])


    const handleChange = () => {
        var investimentoValue = parseFloat(variaveis.investimento)
        
        var tempoValue = parseFloat(variaveis.tempo)
        var cdi = variaveis.cdi
        var selic = variaveis.selic
        //var rendimentoValue = (investimentoValue * ((1 + (cdi * (selic / 100))) ** tempoValue))
        
        setVariaveis({ ...variaveis, rendimento: (investimentoValue * ((1 + (cdi * (selic / 100))) ** tempoValue)) })
    }

    useEffect(() => { handleChange() }, [variaveis.investimento, variaveis.tempo])


    return (
        <div className={`${styles.content} ${roboto.className}`}>
            <div id="root">
                <div className={`${styles.calculadora}`}>
                    <div className={`${styles.formControl}`}>
                        <label htmlFor="investimento" id="valorInvestido">Valor Investido</label>
                        <input
                            type="number"
                            name="investimento"
                            id="investimento"
                            placeholder="Valor Investido"
                            onChange={(e) => setVariaveis({ ...variaveis, investimento: e.target.value })}
                        />
                    </div>
                    <div className={`${styles.formControl}`}>
                        <label htmlFor="tempo">Tempo de Investimento</label>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            id="tempo"
                            name="tempo"
                            onChange={(e) => setVariaveis({ ...variaveis, tempo: e.target.value })} />
                    </div>
                </div>
            </div>
            <div id="resultado" className={`${roboto.className} flex justify-center items-center text-center px-5`}>
                <p>
                    Seu investimento de <span>R$ {variaveis.investimento.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} </span>
                    {variaveis.tempo == 1 ? `em ${variaveis.tempo} ano renderá ` :
                        `em ${variaveis.tempo} anos renderá `} 
                    <span>R$ {variaveis.rendimento.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</span>.
                </p>
            </div>
        </div>
    )
}