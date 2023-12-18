declare module 'free-cleverbot' {
    type Stimulus = string;
    type Context = string[] | undefined;
    type Language =
        'af' | 'id' | 'ms' | 'ca' | 'cs' | 'da' | 'de' | 'en' | 'es' | 'eu' |
        'ti' | 'fr' | 'gl' | 'hr' | 'zu' | 'is' | 'it' | 'lt' | 'hu' | 'nl' |
        'no' | 'pl' | 'pt' | 'ro' | 'sl' | 'fi' | 'sv' | 'vi' | 'tr' | 'el' |
        'bg' | 'ru' | 'sr' | 'uk' | 'ko' | 'zh' | 'ja' | 'hi' | 'th' | undefined;

    /**
     * The main function of the module, which communicates with the Cleverbot API.
     * @param stimulus - The input text for Cleverbot.
     * @param context - Optional conversation context as an array of strings.
     * @param language - Optional language code for the Cleverbot session.
     * @returns The response from Cleverbot as a string.
     * @throws {Error} If it fails to get a response after the maximum number of attempts.
     */
    function CleverBot(stimulus: Stimulus, context?: Context, language?: Language): Promise<string>;

    export = CleverBot;
}
