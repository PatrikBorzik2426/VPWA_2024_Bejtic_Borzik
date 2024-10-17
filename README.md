# VPWA_2024_Bejtic_Borzik
## Cviko 2
- Treba použiť UML na relačnú databázku
- Bez dátových typov
- Bez primary či foreign keys
### Quasar - Adonis 
- [ ] VueEx
- [ ] Lint
- [ ] Webpack
- [ ] Options

### Treba
- Is typing (simulácia)
- Pop-up notifikácia
- V UML modeli musí byť aj kick a iné funkcie

## 1. Fáza - 16.10.2024 (5. týždeň)
- [ ] Dátový logický model v UML notácií @Patrik @Viktor
- [ ] Responzívna klientská časť (prototyp) vo form Single Page Aplication - pomocou Quasar 
    - [ ] Registračný formulár (meno, priezvisko, nick a email) @Patrik
      - [ ] registrácia
      - [ ] prihlásenie
      - [ ] odhlásenia
    - [ ] Zoznam kanálov (user musí byť člen)
      - [ ] opustenie/vyhodenie kanála - vymazanie zo zoznamu
      - [ ] pri pozvaní do kanála - zvýraznenie v zozname, musí byť na vrchu
      - [ ] kanály - môcť vytvoriť, upraviť, presunúť či zrušiť
      - [ ] dva typy - súkromný/verejný
      - [ ] správca kanálu - ten kto kanál vytvoril
      - [ ] 30 dní bez aktivity - kanál prestane existovať
    - [ ] Príkazový riadok v rámci chatu, kde má user pístup
      - [ ] **/list** vypíše zoznam používateľov v kanáli (už prvá fáza)
      - [ ] Vytvorenie kanálu cez príkazový riadok, cez ktorý sa posielajú správy
      - [ ] Vytvorenie súkromného kanálu cez **/join channelName [private]**
      - [ ] Súkromný kanál - pozývať, pridávať/odoberať iba správca cez **/invite nick** a **/revoke nick**
      - [ ] Do verejného kanálu sa môže pridať každý cez **/join channelName** (ak neexistuje vytvorí sa)
      - [ ] Do verejného kanálu môže používateľ pozývať cez **/invite nick**
      - [ ] Vo verejnom kanáli user-i môžu používať **/kick nick** na vyhodenie, ak niekto obdrží kick 3x je banned - toto správca môže robiť priamo **/kick nick**
      - [ ] Nick a channelName sú unikátne
      - [ ] Správca môže kanál zatvoriť/zrušiť cez **/quit**
    - [ ] User sa môže odpojiť pomocou **/cancel** správca zruší kanál týmto príkazom
    - [ ] Mention pomocou **@nick**, kde sa potom danému používateľovi zvýrazní
    - [ ] User si vie pozrieť históriu správ - **efektívny infinite scroll** (už prvá správa)
    - [ ] Notifikácie - nové správy (už prvá fáza)
      - [ ] Zobrazujú sa ak aplikácia nie je viditeľná (Quasar doc App Visibility)
      - [ ] Notifikácia obsahuje odosielateľa a kus správy
      - [ ] Vieme nastaviť, aby chodili notifikácie iba o správa **adresovaných konkrétnemu používateľovi**
    - [ ] Status používateľa (online,offline,dnd):
      - [ ] stava sa vždy zobrazuje používateľom
      - [ ] ak je DND nechodia notify
      - [ ] ak je offline, nechodia správy, inak sú hneď po prepnutí aktualizované
    - [ ] Aktívny kanál v okne ukazuje aktuálne píšucich používateľov v stavovej lište
      - [ ] Po kliknutí na lištu aktívne uvidí píšuci sa text 