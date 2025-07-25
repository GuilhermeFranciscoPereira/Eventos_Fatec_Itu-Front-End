import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

type UseYetiProps = {
    emailRef: React.RefObject<HTMLInputElement | null>;
    passwordRef: React.RefObject<HTMLInputElement | null>;
}

gsap.registerPlugin(MorphSVGPlugin);

export default function useYeti({ emailRef, passwordRef }: UseYetiProps) {
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const showPasswordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        const email = emailRef.current;
        const password = passwordRef.current;
        const showPasswordCheck = showPasswordRef.current;
        const svgContainer = svgContainerRef.current;

        if (!email || !password || !showPasswordCheck || !svgContainer) return;

        // SVG é o primeiro <svg> do container
        const mySVG = svgContainer.querySelector("svg");
        if (!mySVG) return;

        // Elementos necessários
        const getEl = <T extends Element>(selector: string) => (mySVG.querySelector(selector) as T | null);

        const twoFingers = getEl<SVGGElement>(".twoFingers");
        const armL = getEl<SVGGElement>(".armL");
        const armR = getEl<SVGGElement>(".armR");
        const eyeL = getEl<SVGGElement>(".eyeL");
        const eyeR = getEl<SVGGElement>(".eyeR");
        const nose = getEl<SVGPathElement>(".nose");
        const mouth = getEl<SVGGElement>(".mouth");
        const mouthBG = getEl<SVGPathElement>(".mouthBG");
        const mouthSmallBG = getEl<SVGPathElement>(".mouthSmallBG");
        const mouthMediumBG = getEl<SVGPathElement>(".mouthMediumBG");
        const mouthLargeBG = getEl<SVGPathElement>(".mouthLargeBG");
        const mouthMaskPath = getEl<SVGPathElement>("#mouthMaskPath");
        const mouthOutline = getEl<SVGPathElement>(".mouthOutline");
        const tooth = getEl<SVGPathElement>(".tooth");
        const tongue = getEl<SVGGElement>(".tongue");
        const chin = getEl<SVGPathElement>(".chin");
        const face = getEl<SVGPathElement>(".face");
        const eyebrow = getEl<SVGGElement>(".eyebrow");
        const outerEarL = getEl<SVGGElement>(".earL .outerEar");
        const outerEarR = getEl<SVGGElement>(".earR .outerEar");
        const earHairL = getEl<SVGGElement>(".earL .earHair");
        const earHairR = getEl<SVGGElement>(".earR .earHair");
        const hair = getEl<SVGPathElement>(".hair");
        const bodyBG = getEl<SVGPathElement>(".bodyBGnormal");
        const bodyBGchanged = getEl<SVGPathElement>(".bodyBGchanged");

        // Se algum deles não existir, não roda animação!
        if (!twoFingers || !armL || !armR || !eyeL || !eyeR || !nose || !mouth || !mouthBG || !mouthSmallBG || !mouthMediumBG || !mouthLargeBG || !mouthMaskPath || !mouthOutline || !tooth || !tongue || !chin || !face || !eyebrow || !outerEarL || !outerEarR || !earHairL || !earHairR || !hair || !bodyBG || !bodyBGchanged) { return };

        // Estado do avatar
        let mouthStatus: "small" | "medium" | "large" = "small";
        let eyeScale = 1;
        let eyesCovered = false;
        let showPasswordClicked = false;
        let activeElement: "email" | "password" | "toggle" | null = null;
        let blinking: gsap.core.Tween | null = null;

        // Posição facial
        let svgCoords: { x: number; y: number };
        let emailCoords: { x: number; y: number };
        let screenCenter: number;
        let eyeLCoords: { x: number; y: number };
        let eyeRCoords: { x: number; y: number };
        let noseCoords: { x: number; y: number };
        let mouthCoords: { x: number; y: number };
        let emailScrollMax: number;
        let dFromC: number;

        // Auxiliares de posição
        function getPosition(el: HTMLElement): { x: number; y: number } {
            let xPos = 0;
            let yPos = 0;
            let element = el as HTMLElement | null;
            while (element) {
                if (element.tagName === "BODY") {
                    const xScroll =
                        element.scrollLeft || document.documentElement.scrollLeft;
                    const yScroll =
                        element.scrollTop || document.documentElement.scrollTop;
                    xPos += element.offsetLeft - xScroll + element.clientLeft;
                    yPos += element.offsetTop - yScroll + element.clientTop;
                } else {
                    xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
                    yPos += element.offsetTop - element.scrollTop + element.clientTop;
                }
                element = element.offsetParent as HTMLElement | null;
            }
            return { x: xPos, y: yPos };
        }
        function getAngle(
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ): number {
            return Math.atan2(y1 - y2, x1 - x2);
        }

        // --- Animações principais ---
        function calculateFaceMove() {
            if (!email) return;
            const carPos = email.selectionEnd ?? email.value.length;
            const div = document.createElement("div");
            const span = document.createElement("span");
            const copyStyle = getComputedStyle(email);

            [].forEach.call(copyStyle, (prop) => {
                div.style[prop] = copyStyle[prop];
            });
            div.style.position = "absolute";
            document.body.appendChild(div);
            div.textContent = email.value.substr(0, carPos);
            span.textContent = email.value.substr(carPos) || ".";
            div.appendChild(span);

            if (email.scrollWidth <= emailScrollMax) {
                const caretCoords = getPosition(span);
                dFromC = screenCenter - (caretCoords.x + emailCoords.x);
                const eyeLAngle = getAngle(
                    eyeLCoords.x,
                    eyeLCoords.y,
                    emailCoords.x + caretCoords.x,
                    emailCoords.y + 25
                );
                const eyeRAngle = getAngle(
                    eyeRCoords.x,
                    eyeRCoords.y,
                    emailCoords.x + caretCoords.x,
                    emailCoords.y + 25
                );
                const noseAngle = getAngle(
                    noseCoords.x,
                    noseCoords.y,
                    emailCoords.x + caretCoords.x,
                    emailCoords.y + 25
                );
                const mouthAngle = getAngle(
                    mouthCoords.x,
                    mouthCoords.y,
                    emailCoords.x + caretCoords.x,
                    emailCoords.y + 25
                );

                const eyeLX = Math.cos(eyeLAngle) * 20;
                const eyeLY = Math.sin(eyeLAngle) * 10;
                const eyeRX = Math.cos(eyeRAngle) * 20;
                const eyeRY = Math.sin(eyeRAngle) * 10;
                const noseX = Math.cos(noseAngle) * 23;
                const noseY = Math.sin(noseAngle) * 10;
                const mouthX = Math.cos(mouthAngle) * 23;
                const mouthY = Math.sin(mouthAngle) * 10;
                const mouthR = Math.cos(mouthAngle) * 6;
                const chinX = mouthX * 0.8;
                const chinY = mouthY * 0.5;
                let chinS = 1 - (dFromC * 0.15) / 100;
                if (chinS > 1) {
                    chinS = 1 - (chinS - 1);
                    if (chinS < 0.5) {
                        chinS = 0.5;
                    }
                }
                const faceX = mouthX * 0.3;
                const faceY = mouthY * 0.4;
                const faceSkew = Math.cos(mouthAngle) * 5;
                const eyebrowSkew = Math.cos(mouthAngle) * 25;
                const outerEarX = Math.cos(mouthAngle) * 4;
                const outerEarY = Math.cos(mouthAngle) * 5;
                const hairX = Math.cos(mouthAngle) * 6;
                const hairS = 1.2;

                gsap.to(eyeL, { x: -eyeLX, y: -eyeLY, duration: 1, ease: "expo.out" });
                gsap.to(eyeR, { x: -eyeRX, y: -eyeRY, duration: 1, ease: "expo.out" });
                gsap.to(nose, {
                    x: -noseX,
                    y: -noseY,
                    rotation: mouthR,
                    transformOrigin: "center center",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(mouth, {
                    x: -mouthX,
                    y: -mouthY,
                    rotation: mouthR,
                    transformOrigin: "center center",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(chin, {
                    x: -chinX,
                    y: -chinY,
                    scaleY: chinS,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(face, {
                    x: -faceX,
                    y: -faceY,
                    skewX: -faceSkew,
                    transformOrigin: "center top",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(eyebrow, {
                    x: -faceX,
                    y: -faceY,
                    skewX: -eyebrowSkew,
                    transformOrigin: "center top",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(outerEarL, {
                    x: outerEarX,
                    y: -outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(outerEarR, {
                    x: outerEarX,
                    y: outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(earHairL, {
                    x: -outerEarX,
                    y: -outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(earHairR, {
                    x: -outerEarX,
                    y: outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(hair, {
                    x: hairX,
                    scaleY: hairS,
                    transformOrigin: "center bottom",
                    duration: 1,
                    ease: "expo.out",
                });

            } else {
                const eyeLAngle = getAngle(
                    eyeLCoords.x,
                    eyeLCoords.y,
                    emailCoords.x + emailScrollMax,
                    emailCoords.y + 25
                );
                const eyeRAngle = getAngle(
                    eyeRCoords.x,
                    eyeRCoords.y,
                    emailCoords.x + emailScrollMax,
                    emailCoords.y + 25
                );
                const noseAngle = getAngle(
                    noseCoords.x,
                    noseCoords.y,
                    emailCoords.x + emailScrollMax,
                    emailCoords.y + 25
                );
                const mouthAngle = getAngle(
                    mouthCoords.x,
                    mouthCoords.y,
                    emailCoords.x + emailScrollMax,
                    emailCoords.y + 25
                );

                const eyeLX = Math.cos(eyeLAngle) * 20;
                const eyeLY = Math.sin(eyeLAngle) * 10;
                const eyeRX = Math.cos(eyeRAngle) * 20;
                const eyeRY = Math.sin(eyeRAngle) * 10;
                const noseX = Math.cos(noseAngle) * 23;
                const noseY = Math.sin(noseAngle) * 10;
                const mouthX = Math.cos(mouthAngle) * 23;
                const mouthY = Math.sin(mouthAngle) * 10;
                const mouthR = Math.cos(mouthAngle) * 6;
                const chinX = mouthX * 0.8;
                const chinY = mouthY * 0.5;
                let chinS = 1 - (dFromC * 0.15) / 100;
                if (chinS > 1) {
                    chinS = 1 - (chinS - 1);
                    if (chinS < 0.5) {
                        chinS = 0.5;
                    }
                }
                const faceX = mouthX * 0.3;
                const faceY = mouthY * 0.4;
                const faceSkew = Math.cos(mouthAngle) * 5;
                const eyebrowSkew = Math.cos(mouthAngle) * 25;
                const outerEarX = Math.cos(mouthAngle) * 4;
                const outerEarY = Math.cos(mouthAngle) * 5;
                const hairX = Math.cos(mouthAngle) * 6;
                const hairS = 1.2;

                gsap.to(eyeL, { x: -eyeLX, y: -eyeLY, duration: 1, ease: "expo.out" });
                gsap.to(eyeR, { x: -eyeRX, y: -eyeRY, duration: 1, ease: "expo.out" });
                gsap.to(nose, {
                    x: -noseX,
                    y: -noseY,
                    rotation: mouthR,
                    transformOrigin: "center center",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(mouth, {
                    x: -mouthX,
                    y: -mouthY,
                    rotation: mouthR,
                    transformOrigin: "center center",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(chin, {
                    x: -chinX,
                    y: -chinY,
                    scaleY: chinS,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(face, {
                    x: -faceX,
                    y: -faceY,
                    skewX: -faceSkew,
                    transformOrigin: "center top",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(eyebrow, {
                    x: -faceX,
                    y: -faceY,
                    skewX: -eyebrowSkew,
                    transformOrigin: "center top",
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(outerEarL, {
                    x: outerEarX,
                    y: -outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(outerEarR, {
                    x: outerEarX,
                    y: outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(earHairL, {
                    x: -outerEarX,
                    y: -outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(earHairR, {
                    x: -outerEarX,
                    y: outerEarY,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(hair, {
                    x: hairX,
                    scaleY: hairS,
                    transformOrigin: "center bottom",
                    duration: 1,
                    ease: "expo.out",
                });
            }
            document.body.removeChild(div);
        }

        function onEmailInput() {
            if (!email) return;
            calculateFaceMove();
            const value = email.value;
            const curEmailIndex = value.length;

            // Boca e olhos conforme digita e @
            if (!mouthMediumBG) return;
            if (curEmailIndex > 0) {
                if (mouthStatus === "small") {
                    mouthStatus = "medium";
                    gsap.to([mouthBG, mouthOutline, mouthMaskPath], {
                        morphSVG: mouthMediumBG,
                        duration: 1,
                        ease: "expo.out",
                    });
                    gsap.to(tooth, { x: 0, y: 0, duration: 1, ease: "expo.out" });
                    gsap.to(tongue, { x: 0, y: 1, duration: 1, ease: "expo.out" });
                    gsap.to([eyeL, eyeR], {
                        scaleX: 0.85,
                        scaleY: 0.85,
                        duration: 1,
                        ease: "expo.out",
                        transformOrigin: "center center",
                    });
                    eyeScale = 0.85;
                }
                if (value.includes("@")) {
                    mouthStatus = "large";
                    if (!mouthLargeBG) return;
                    gsap.to([mouthBG, mouthOutline, mouthMaskPath], {
                        morphSVG: mouthLargeBG,
                        duration: 1,
                        ease: "expo.out",
                    });
                    gsap.to(tooth, { x: 3, y: -2, duration: 1, ease: "expo.out" });
                    gsap.to(tongue, { y: 2, duration: 1, ease: "expo.out" });
                    gsap.to([eyeL, eyeR], {
                        scaleX: 0.65,
                        scaleY: 0.65,
                        duration: 1,
                        ease: "expo.out",
                        transformOrigin: "center center",
                    });
                    eyeScale = 0.65;
                } else {
                    mouthStatus = "medium";
                    gsap.to([mouthBG, mouthOutline, mouthMaskPath], {
                        morphSVG: mouthMediumBG,
                        duration: 1,
                        ease: "expo.out",
                    });
                    gsap.to(tooth, { x: 0, y: 0, duration: 1, ease: "expo.out" });
                    gsap.to(tongue, { x: 0, y: 1, duration: 1, ease: "expo.out" });
                    gsap.to([eyeL, eyeR], {
                        scaleX: 0.85,
                        scaleY: 0.85,
                        duration: 1,
                        ease: "expo.out",
                    });
                    eyeScale = 0.85;
                }
            } else {
                if (!mouthSmallBG) return;
                mouthStatus = "small";
                gsap.to([mouthBG, mouthOutline, mouthMaskPath], {
                    morphSVG: mouthSmallBG,
                    duration: 1,
                    ease: "expo.out",
                });
                gsap.to(tooth, { x: 0, y: 0, duration: 1, ease: "expo.out" });
                gsap.to(tongue, { y: 0, duration: 1, ease: "expo.out" });
                gsap.to([eyeL, eyeR], {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 1,
                    ease: "expo.out",
                });
                eyeScale = 1;
            }
        }
        function onToggleChange(e: Event) {
            const checked = (e.target as HTMLInputElement).checked;
            setShowPassword(checked);
            if (checked) { spreadFingers() } else { closeFingers() }
        }
        showPasswordRef.current!.addEventListener('change', onToggleChange);
        function onEmailFocus(e: FocusEvent) {
            activeElement = "email";
            (e.target as HTMLElement).parentElement?.classList.add("focusWithText");
            onEmailInput();
        }
        function onEmailBlur(e: FocusEvent) {
            activeElement = null;
            setTimeout(() => {
                if (activeElement === "email") return;
                if ((e.target as HTMLInputElement).value === "") {
                    (e.target as HTMLElement).parentElement?.classList.remove(
                        "focusWithText"
                    );
                }
                resetFace();
            }, 100);
        }
        function onPasswordFocus() {
            activeElement = "password";
            if (!eyesCovered) coverEyes();
        }
        function onPasswordBlur() {
            activeElement = null;
            setTimeout(() => {
                if (activeElement === "toggle" || activeElement === "password") return;
                uncoverEyes();
            }, 100);
        }
        function onPasswordToggleFocus() {
            activeElement = "toggle";
            if (!eyesCovered) coverEyes();
        }
        function onPasswordToggleBlur() {
            activeElement = null;
            if (!showPasswordClicked) {
                setTimeout(() => {
                    if (
                        activeElement === "password" ||
                        activeElement === "toggle"
                    )
                        return;
                    uncoverEyes();
                }, 100);
            }
        }
        function onPasswordToggleMouseDown() {
            showPasswordClicked = true;
        }
        function onPasswordToggleMouseUp() {
            showPasswordClicked = false;
        }
        function onPasswordToggleChange(e: Event) {
            if (!password) return;
            setTimeout(() => {
                if ((e.target as HTMLInputElement).checked) {
                    password.type = "text";
                    spreadFingers();
                } else {
                    password.type = "password";
                    closeFingers();
                }
            }, 100);
        }
        function onPasswordToggleClick(e: Event) {
            (e.target as HTMLElement).focus();
        }
        function spreadFingers() {
            gsap.to(twoFingers, {
                transformOrigin: "bottom left",
                rotation: 30,
                x: -9,
                y: -2,
                duration: 0.35,
                ease: "power2.inOut",
            });
        }
        function closeFingers() {
            gsap.to(twoFingers, {
                transformOrigin: "bottom left",
                rotation: 0,
                x: 0,
                y: 0,
                duration: 0.35,
                ease: "power2.inOut",
            });
        }
        function coverEyes() {
            gsap.killTweensOf([armL, armR]);
            gsap.set([armL, armR], { visibility: "visible" });
            gsap.to(armL, {
                x: -93,
                y: 10,
                rotation: 0,
                duration: 0.45,
                ease: "quad.out",
            });
            gsap.to(armR, {
                x: -93,
                y: 10,
                rotation: 0,
                duration: 0.45,
                delay: 0.1,
                ease: "quad.out",
            });
            if (!bodyBGchanged) return;
            gsap.to(bodyBG, {
                morphSVG: bodyBGchanged,
                duration: 0.45,
                ease: "quad.out",
            });
            eyesCovered = true;
        }
        function uncoverEyes() {
            gsap.killTweensOf([armL, armR]);
            gsap.to(armL, {
                y: 220,
                duration: 1.35,
                ease: "quad.out",
            });
            gsap.to(armL, {
                rotation: 105,
                duration: 1.35,
                delay: 0.1,
                ease: "quad.out",
            });
            gsap.to(armR, {
                y: 220,
                duration: 1.35,
                ease: "quad.out",
            });
            gsap.to(armR, {
                rotation: -105,
                duration: 1.35,
                delay: 0.1,
                ease: "quad.out",
                onComplete: () => {
                    gsap.set([armL, armR], { visibility: "hidden" });
                },
            });
            if (!bodyBG) return;
            gsap.to(bodyBG, {
                morphSVG: bodyBG,
                duration: 0.45,
                ease: "quad.out",
            });
            eyesCovered = false;
        }
        function resetFace() {
            gsap.to([eyeL, eyeR], {
                x: 0,
                y: 0,
                duration: 1,
                ease: "expo.out",
            });
            gsap.to(nose, {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                duration: 1,
                ease: "expo.out",
            });
            gsap.to(mouth, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 1,
                ease: "expo.out",
            });
            gsap.to(chin, {
                x: 0,
                y: 0,
                scaleY: 1,
                duration: 1,
                ease: "expo.out",
            });
            gsap.to([face, eyebrow], {
                x: 0,
                y: 0,
                skewX: 0,
                duration: 1,
                ease: "expo.out",
            });
            gsap.to(
                [outerEarL, outerEarR, earHairL, earHairR, hair],
                { x: 0, y: 0, scaleY: 1, duration: 1, ease: "expo.out" }
            );
        }
        function startBlinking(delay?: number) {
            if (!delay) delay = 1;
            blinking = gsap.to([eyeL, eyeR], {
                delay,
                scaleY: 0,
                yoyo: true,
                repeat: 1,
                transformOrigin: "center center",
                duration: 0.1,
                onComplete: () => startBlinking(12),
            });
        }
        function stopBlinking() {
            if (blinking) blinking.kill();
            blinking = null;
            gsap.set([eyeL, eyeR], { scaleY: eyeScale });
        }

        // --- INICIALIZAÇÃO (executado uma vez ao montar) ---
        function init() {
            // Medidas iniciais
            if (!email || !password || !showPasswordCheck || !svgContainer) return;

            svgCoords = getPosition(svgContainer);
            emailCoords = getPosition(email);
            screenCenter = svgCoords.x + (svgContainer.offsetWidth / 2);
            eyeLCoords = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
            eyeRCoords = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
            noseCoords = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
            mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };

            email.addEventListener("focus", onEmailFocus);
            email.addEventListener("blur", onEmailBlur);
            email.addEventListener("input", onEmailInput);

            password.addEventListener("focus", onPasswordFocus);
            password.addEventListener("blur", onPasswordBlur);

            showPasswordCheck.addEventListener("change", onPasswordToggleChange);
            showPasswordCheck.addEventListener("focus", onPasswordToggleFocus);
            showPasswordCheck.addEventListener("blur", onPasswordToggleBlur);
            showPasswordCheck.addEventListener("click", onPasswordToggleClick);
            const toggleLabel = svgContainer.querySelector(
                "#showPasswordToggle"
            ) as HTMLElement | null;
            if (toggleLabel) {
                toggleLabel.addEventListener("mouseup", onPasswordToggleMouseUp);
                toggleLabel.addEventListener("mousedown", onPasswordToggleMouseDown);
            }

            // Posição inicial dos braços
            gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
            gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });

            gsap.set(mouth, { transformOrigin: "center center" });

            startBlinking(5);

            // Limite do scroll do input email (para saber até onde olhar)
            emailScrollMax = email.scrollWidth;

            // Mobile: mostrar senha
            if (window && /Mobi|Android/i.test(window.navigator.userAgent)) {
                password.type = "text";
                showPasswordCheck.checked = false;
            }
        }

        init();

        // Limpa listeners no unmount
        return () => {
            email.removeEventListener("focus", onEmailFocus);
            email.removeEventListener("blur", onEmailBlur);
            email.removeEventListener("input", onEmailInput);

            password.removeEventListener("focus", onPasswordFocus);
            password.removeEventListener("blur", onPasswordBlur);

            showPasswordCheck.removeEventListener("change", onPasswordToggleChange);
            showPasswordCheck.removeEventListener("focus", onPasswordToggleFocus);
            showPasswordCheck.removeEventListener("blur", onPasswordToggleBlur);
            showPasswordCheck.removeEventListener("click", onPasswordToggleClick);
            const toggleLabel = svgContainer.querySelector(
                "#showPasswordToggle"
            ) as HTMLElement | null;
            if (toggleLabel) {
                toggleLabel.removeEventListener("mouseup", onPasswordToggleMouseUp);
                toggleLabel.removeEventListener("mousedown", onPasswordToggleMouseDown);
            }
            stopBlinking();
        };
    }, [emailRef, passwordRef]);

    return { showPasswordRef, svgContainerRef, showPassword }
};
