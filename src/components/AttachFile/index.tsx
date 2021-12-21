import React, {useEffect} from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Delete from '@mui/icons-material/Delete';
import { useAxios } from '../../hooks/useAxios';

import {Anexo} from '../../common/types';

type AttachFileProps = {
  anexo: Anexo;
  taskId: number;
}

type ResponseGetAttachedFile = Blob;

const AttachFile = (props:AttachFileProps) => {
  const { taskId, anexo } = props;

  const {
    commit: commitDownloadAnexo,
    response,
    loading
  } = useAxios<ResponseGetAttachedFile>({
    method: 'GET',
    path: `tarefas/${taskId}/anexos/${anexo.id}`
  });

  useEffect(() => {
    if(response && !loading) {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', anexo.nome);
      document.body.appendChild(link);
      link.click();
    }
  }, [response, loading]);

  const downloadAnexo = () => {
    commitDownloadAnexo(
      undefined, 
      undefined,
      undefined,
      'blob'
    );
  };

  const handleDeleteAttachment = async (taskId: number, anexo: Anexo) => {
      let response: any;
      try {
        response = await axios({
          method: 'DELETE',
          url: `http://localhost:8080/tarefas/${taskId}/anexos/${anexo.id}`,
          headers: {
            Authorization: `Bearer ${tokenObj!.token}`
          },
        });
        window.location.reload();
      } catch (error) {
        console.log('Erro ao excluir o anexo da tarefa. Log de erro:', error);
      }
    };
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={4}>
            <IconButton edge="end" aria-label="Excluir anexo" component="span"
                onClick={() => { handleDeleteAttachment(taskId, anexo); }}>
                <Delete />
            </IconButton>
        </Grid>
        <Grid item xs={4}>
            <ListItemButton sx={{ pl: 4 }} onClick={() => {downloadAnexo()}}>
                <ListItemText primary={anexo.nome} />
            </ListItemButton>
        </Grid>
    </Grid>
  )
}

export default AttachFile;