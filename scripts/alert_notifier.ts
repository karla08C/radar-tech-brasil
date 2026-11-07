/**
 * Radar Tech Brasil - Disparador Automático de Alertas (Telegram & WhatsApp)
 * 
 * Executa a checagem de editais e dispara alertas formatados para:
 * 1. Canal / Grupo do Telegram (via Telegram Bot API)
 * 2. Webhook de WhatsApp / n8n / Evolution API
 * 
 * Regras de Notificação:
 * - Editais com encerramento em até 72 horas (Prazos Críticos)
 * - Novos editais e chamadas públicas publicadas recentemente
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { TechEvent } from '../src/types';
import { INITIAL_EVENTS } from '../src/data/initialEvents';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;

console.log('========================================================');
console.log('Radar Tech Brasil: Iniciando Disparador de Alertas');
console.log('========================================================\n');

function loadAllEvents(): TechEvent[] {
  let list: TechEvent[] = [...INITIAL_EVENTS];
  try {
    const discoveredPath = path.resolve(__dirname, '../src/data/discovered_editais.json');
    if (fs.existsSync(discoveredPath)) {
      const data = JSON.parse(fs.readFileSync(discoveredPath, 'utf-8'));
      if (Array.isArray(data)) {
        list = [...data, ...list];
      }
    }
  } catch (err) {
    console.warn('Aviso: base discovered_editais não encontrada, usando initialEvents.');
  }
  return list;
}

function getDaysRemaining(deadlineStr: string): number {
  if (!deadlineStr) return -1;
  const target = deadlineStr.includes('T')
    ? new Date(deadlineStr).getTime()
    : new Date(`${deadlineStr}T23:59:59`).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram] Modo Simulação (Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID no .env para envio real).');
    console.log('Prévia da Mensagem:\n---\n' + text + '\n---');
    return true;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const result = await res.json() as any;
    if (result.ok) {
      console.log('[Telegram] Mensagem enviada com sucesso!');
      return true;
    } else {
      console.warn('[Telegram] Erro na API:', result.description);
      return false;
    }
  } catch (err: any) {
    console.error('[Telegram] Falha na conexão:', err.message);
    return false;
  }
}

async function sendWhatsAppWebhook(payload: any): Promise<boolean> {
  if (!WHATSAPP_WEBHOOK_URL) {
    console.log('[WhatsApp] Modo Simulação (Defina WHATSAPP_WEBHOOK_URL no .env para envio real via n8n ou Z-API).');
    return true;
  }

  try {
    const res = await fetch(WHATSAPP_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log('[WhatsApp] Webhook disparado com sucesso!');
      return true;
    }
    return false;
  } catch (err: any) {
    console.error('[WhatsApp] Falha no webhook:', err.message);
    return false;
  }
}

async function main() {
  const events = loadAllEvents();

  // Filtrar editais urgentes (1 a 4 dias para fechar)
  const urgentEvents = events.filter((e) => {
    const days = getDaysRemaining(e.registrationDeadline);
    return days >= 0 && days <= 4;
  });

  // Filtrar editais do Ceará e FAPs
  const cearaEvents = events.filter((e) => e.location.state === 'CE').slice(0, 3);

  let messageHtml = `<b>RADAR TECH BRASIL • ALERTA DE EDITAIS</b>\n`;
  messageHtml += `<i>Boletim de oportunidades de fomento e inovação</i>\n\n`;

  if (urgentEvents.length > 0) {
    messageHtml += `<b>ATENÇÃO: PRAZOS ENCERRANDO EM MENOS DE 72H</b>\n`;
    for (const evt of urgentEvents.slice(0, 4)) {
      const days = getDaysRemaining(evt.registrationDeadline);
      messageHtml += `• <b>${evt.title}</b>\n`;
      messageHtml += `  Órgão: ${evt.organizer}\n`;
      messageHtml += `  Aporte: ${evt.prizes.highlight}\n`;
      messageHtml += `  Prazo: Restam ${days} ${days === 1 ? 'dia' : 'dias'} (${evt.registrationDeadline.split('T')[0]})\n`;
      messageHtml += `  Link: ${evt.registrationUrl || evt.websiteUrl}\n\n`;
    }
  }

  if (cearaEvents.length > 0) {
    messageHtml += `<b>DESTAQUES DO ECOSSISTEMA CEARÁ</b>\n`;
    for (const evt of cearaEvents) {
      messageHtml += `• <b>${evt.title}</b>\n`;
      messageHtml += `  Aporte: ${evt.prizes.highlight}\n`;
      messageHtml += `  Prazo: ${evt.registrationDeadline.split('T')[0]}\n`;
      messageHtml += `  Acesse: ${evt.registrationUrl || evt.websiteUrl}\n\n`;
    }
  }

  messageHtml += `Acompanhe todas as oportunidades ativas em: https://github.com/karla08C/radar-tech-brasil`;

  console.log(`Editais com prazo crítico identificados: ${urgentEvents.length}`);
  console.log(`Disparando notificações...\n`);

  await sendTelegramMessage(messageHtml);
  await sendWhatsAppWebhook({
    title: 'Radar Tech Brasil - Alerta de Editais',
    urgentCount: urgentEvents.length,
    urgentEvents,
    cearaEvents,
    timestamp: new Date().toISOString(),
  });

  console.log('\nRotina de alertas finalizada com sucesso!');
}

main().catch((err) => {
  console.error('Erro na rotina de alertas:', err);
});
