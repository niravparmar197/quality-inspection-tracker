export function getDialogSx(isMobile: boolean) {
  return {
    '& .MuiDialog-container': {
      alignItems: isMobile ? 'flex-end' : 'center',
    },
    '& .MuiPaper-root': {
      width: '100%',
      maxWidth: isMobile ? '100%' : 460,
      maxHeight: '88vh',
      borderRadius: isMobile ? '20px 20px 0 0' : '16px',
      margin: isMobile ? 0 : undefined,
    },
  }
}
