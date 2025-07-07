# Thesis data with pro/con arguments
THESIS_DATA = {
    "1": {
        "thesis_text": "Deutschland soll die Ukraine weiterhin militärisch unterstützen.",
        "pro": "Die militärische Unterstützung der Ukraine ist ein wichtiger Beitrag zur Verteidigung demokratischer Werte und des Völkerrechts. Deutschland hat als Teil der NATO und EU eine Verantwortung, Ländern zu helfen, die völkerrechtswidrig angegriffen werden. Militärhilfe kann dazu beitragen, dass die Ukraine ihre territoriale Integrität verteidigen und einen gerechten Frieden verhandeln kann. Zudem stärkt die Unterstützung das Vertrauen in die internationale Rechtsordnung und zeigt anderen potentiellen Aggressoren Grenzen auf.",
        "contra": "Kritiker argumentieren, dass militärische Unterstützung das Risiko einer Eskalation des Konflikts erhöht und Deutschland direkt in kriegerische Handlungen verwickeln könnte. Die Bereitstellung von Waffen verlängere möglicherweise den Krieg und führe zu mehr Leid auf allen Seiten. Stattdessen sollte Deutschland sich auf diplomatische Lösungen und humanitäre Hilfe konzentrieren. Auch die hohen Kosten und die Belastung der eigenen Bundeswehr-Bestände werden als problematisch angesehen."
    },
    "4": {
        "thesis_text": "Auf allen Autobahnen soll ein generelles Tempolimit gelten.",
        "pro": "Ein Tempolimit würde nachweislich die Verkehrssicherheit erhöhen und die Zahl schwerer Unfälle reduzieren. Zudem führt es zu geringerem Kraftstoffverbrauch und damit zu weniger CO2-Emissionen, was dem Klimaschutz dient. Ein einheitliches Tempolimit sorgt für einen gleichmäßigeren Verkehrsfluss und kann Staus reduzieren. Deutschland wäre damit im internationalen Vergleich nicht mehr der Sonderfall, da fast alle anderen europäischen Länder bereits Tempolimits haben. Die Maßnahme ist kostengünstig umsetzbar und würde sofort wirken.",
        "contra": "Kritiker betonen die traditionelle Freiheit auf deutschen Autobahnen und sehen ein Tempolimit als unnötige Bevormundung. Deutsche Autobahnen gelten bereits als sehr sicher, und moderne Fahrzeuge verfügen über fortschrittliche Sicherheitstechnologien. Ein pauschales Limit berücksichtige nicht die unterschiedlichen Gegebenheiten verschiedener Autobahnabschnitte. Zudem könnte es wirtschaftliche Nachteile für die deutsche Automobilindustrie bedeuten, da Hochgeschwindigkeitstests auf deutschen Autobahns ein wichtiger Standortfaktor sind. Die Klimawirkung wird als gering eingeschätzt."
    },
    "5": {
        "thesis_text": "Asylsuchende, die über einen anderen EU-Staat eingereist sind, sollen an den deutschen Grenzen abgewiesen werden.",
        "pro": "Die konsequente Anwendung der Dublin-Verordnung würde zu einer gerechteren Verteilung der Asylsuchenden in der EU führen und verhindern, dass Deutschland überproportional belastet wird. Grenzkontrollen könnten die irreguläre Migration reduzieren und sicherstellen, dass Asylverfahren in dem EU-Land durchgeführt werden, das nach EU-Recht zuständig ist. Dies könnte auch den Anreiz verringern, sich das vermeintlich attraktivste Zielland auszusuchen. Eine solche Maßnahme würde die Kontrolle über die Migrationsbewegungen stärken und das Vertrauen in geordnete Verfahren erhöhen.",
        "contra": "Kritiker wenden ein, dass eine pauschale Abweisung gegen europäisches Recht und die Genfer Flüchtlingskonvention verstoßen könnte. Asylsuchende haben das Recht auf eine individuelle Prüfung ihres Falls. Viele südliche EU-Staaten sind bereits überlastet, und eine strikte Dublin-Anwendung würde diese Ungleichgewichte verstärken. Zudem gibt es praktische Probleme: Nicht immer lässt sich eindeutig nachweisen, über welches Land jemand eingereist ist. Eine Abweisung könnte Menschen in prekäre Situationen zurückschicken, ohne dass ihre Schutzbedürftigkeit geprüft wurde."
    }
}

def get_thesis_data(thesis_id):
    """Get thesis data by ID (accepts int or str)"""
    return THESIS_DATA.get(str(thesis_id))
