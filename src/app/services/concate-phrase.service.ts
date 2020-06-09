import { Injectable } from '@angular/core';

const CROSS_WORDS_NUMBER = 4;

@Injectable({
    providedIn: 'root',
})
export class ConcatPhraseService {

    private words: string[] = [];

    public get text(): string {
        return this.words.join(' ');
    }

    public clearText(): void {
        this.words = [];
    }

    public appendPhrase(phrase: string): void {
        if (!phrase) {
            return;
        }

        const phraseWords: string[] = phrase.split(' ');

        if (this.words.length === 0) {
            this.words = phraseWords;
        } else {
            let endWordIndex = -1;
            const startWordIndex = phraseWords
                .slice(0, CROSS_WORDS_NUMBER)
                .findIndex(dt => {
                    endWordIndex = this.words
                        .slice(-CROSS_WORDS_NUMBER)
                        .findIndex(rt => normalizeWord(rt) === normalizeWord(dt));
                    return endWordIndex > -1;
                });
            if (startWordIndex > -1) {
                this.words.splice(
                    this.words.length - (CROSS_WORDS_NUMBER - endWordIndex),
                    CROSS_WORDS_NUMBER - endWordIndex);
                this.words.push(...(phraseWords.slice(startWordIndex)));
            } else {
                this.words.push(...phraseWords);
            }
        }
    }
}

function normalizeWord(word: string): string {
    let normalizedWord = word.toLowerCase();
    normalizedWord = normalizedWord.replace(/(,|\.|:|\?|!|;|-)*$/, '');
    return normalizedWord;
}
