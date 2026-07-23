export interface GreetingResult {
  greeting: string;
  message: string;
  reflection: string;
}

export function getGreeting(
  firstName: string,
): GreetingResult {

  const now = new Date();

  const hour = now.getHours();
  const day = now.getDay(); // 0=Sun ... 5=Fri

  let greeting = "";
  let message = "";

  if (hour < 12)
    greeting = `Guten Morgen, ${firstName} 👋`;
  else if (hour < 18)
    greeting = `Guten Tag, ${firstName} 👋`;
  else
    greeting = `Guten Abend, ${firstName} 👋`;

  if (day === 1) {
    message =
      "Willkommen in einer neuen Woche. Ich wünsche Ihnen einen guten Start und einen erfolgreichen Tag.";
  } else if (day === 5) {
    message =
      "Vielen Dank für Ihren Einsatz in dieser Woche. Ich wünsche Ihnen einen erfolgreichen Freitag.";
  } else {
    message =
      "Schön, dass Sie wieder da sind. Ich wünsche Ihnen einen erfolgreichen Arbeitstag.";
  }

  const reflections = [

    "Jedes Kind verdient einen sicheren Ort und verlässliche Begleitung.",

    "Sorgfältige Dokumentation schafft Klarheit und unterstützt gute Entscheidungen.",

    "Kleine Schritte können einen großen Unterschied im Leben eines Kindes machen.",

    "Gemeinsam schaffen wir Perspektiven für Kinder und Familien.",

    "Hinter jeder Fallakte steht ein Mensch, der Unterstützung braucht.",

    "Ihre Arbeit trägt dazu bei, Kindern Sicherheit und Zukunft zu geben.",

  ];

  const reflection =
    reflections[
      now.getDate() %
      reflections.length
    ];

  return {
    greeting,
    message,
    reflection,
  };
}