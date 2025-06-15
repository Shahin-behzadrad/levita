export const ConnectGoogleButton = () => {
  const connect = () => {
    window.location.href = "/api/google/auth";
  };

  return <button onClick={connect}>Connect Google Calendar</button>;
};
