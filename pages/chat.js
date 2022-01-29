import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQxMTU4MywiZXhwIjoxOTU4OTg3NTgzfQ.iaNO8qE2uRQeQmP3l29pyvzuI80P891-xK6JcGOp81Y'
const SUPABASE_URL = 'https://vtthdvhpklogzjydvefa.supabase.co'
//links do supabase para conexão
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function ChatPage() {
  // Sua lógica vai aqui
  const [mensagem, setMensagem] = React.useState('')
  const [listaDeMensagens, setListaDeMensagens] = React.useState([])

  React.useEffect(() => {
    //useEffect controla dados que não precisam ser recarregados com tanta frequência
    supabaseClient
      .from('mensagens')
      //pega a tabela mensagens
      .select('*')
      //seleciona todos os dados
      .order('id', { ascending: false })
      //reorganiza a ordem das mensagens, pelo supabase
      .then(({ data }) => {
        //em vez de criar uma variavel, pega o objeto da função
        console.log('Dados da consulta:', data)
        setListaDeMensagens(data)
      })
    //pegando as tabelas
  }, [])
  //só faz o useEffect depois de atualizar a listaDeMensagens

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: 'bartolace',
      texto: novaMensagem
    }
    //transforma a mensagem nova em um objeto

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      //colocando as mensagens no banco de dados
      .then(({ data }) => {
        console.log('Criando mensagem:', data)
        setListaDeMensagens([
          // guarda as mensagens na listaDeMensagem após teclado Enter, //para usar as variáveis dos estados, primiero tem que chamar a função do estado, //os três pontos faz pegar os ITENS da lista
          data[0],
          ...listaDeMensagens
        ])
      })

    // Retorna a array vazia no estado quando é teclado Enter
    setMensagem('')
  }
  //
  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          <MessageList mensagens={listaDeMensagens} />
          {/* posso receber o componente com qualquer nome na propriedade */}

          {/* {listaDeMensagens.map(mensagemAtual => {
            // mapeia os itens e gera uma nova saída com tag
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
              //retorna o objeto, mas pegando o seus valores e juntando para printar
            )
          })} */}

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={mensagem}
              //capta o que está sendo digitado no geral
              onChange={event => {
                const valor = event.target.value
                setMensagem(valor)
              }}
              //

              onKeyPress={event => {
                //capta cada tecla digitada
                //console.log(event) = mostra o que onKeyPress faz, ajuda a nos encontrar
                if (event.key === 'Enter') {
                  event.preventDefault()
                  //event pego da propriedade onKeyPress
                  //função pronta para voltar ao compotamento normal após enter
                  handleNovaMensagem(mensagem)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  // recebe as propriedades passadas do seu própio componente
  console.log(props)
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px'
      }}
    >
      {props.mensagens.map(mensagem => {
        //pega a propriedade mensagens do componente MessageList que é um objeto, usa o map para percorrer cada mensagem e adicionar mais informações
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {mensagem.texto}
          </Text>
        )
      })}
    </Box>
  )
}
