# Flappy bird

```ts
//Add engine components
GameWindow.AddGameComponent(new RenderEngineComponent());
GameWindow.AddGameComponent(new PhysicsEngineComponent());
GameWindow.AddGameComponent(new InbputSystemEngineComponent());

//Add first scene game objects
const scene1 = new GameObject();

//Add only one child (this will be the scene in our convention)
GameWindow.Root.AddChild(scene1);

//Add play button
const playButton = new GameObject();
playButton.AddLayer(new SpriteObjectLayer("play.png"));
playButton.Transform.Position = new Vector2(0, 0);

class ButtonInput extends InputBehavior {
    start() {
        const mouse = GameWindow.GetEngineComponent<InputSystemEngineComponent>().Get<Mouse>();
        mouse.onMouseMove.AddObserver(this.onMouseMove);
        mouse.onLeftClick.AddObserver(this.onMouseClick);
    }
    onMouseMove(position : Vector2) {
        const physics = GameWindow.GetEngineComponent<PhysicsEngineComponent>();
        const gameObjectArray = physics.raycast(position);
        logic.isHovered = (gameObjectArray.includes(this.gameObject));
    }

    onMouseClick() {
        if (isHovered) {
            logic.onClick();
        }
    }
}

class Button extends LogicBehavior {
    isHovered = false;
    
    onClick() {
        //Switch de scene
        GameWindow.Root.RemoveChild(scene1);
        const scene2 = GameObject.FromSerialized(…json);
        GameWindow.Root.AddChild(scene2);
    }
    
}

class ButtonView extends RenderBehavior {
    onDataChanged() {
        if (logic.isHovered) {
            this.gameObject.Transform.Scale = new Vector2(1.1, 1.1);
        } else {
            this.gameObject.Transform.Scale = new Vector2(1, 1);
        }
    }
}

playButton.AddBehavior(new ButtonInput());
playButton.AddBehavior(new Button());
playButton.AddBehavior(new ButtonView());

const buttonScript = new Button();

```

## In game
Object that jump :
```ts
const flappyBird = new GameObject();
flappyBird.addComponent(new RigidbodyJumperWebControls());
flappyBird.addComponent(new RigidbodyJumper());
flappyBird.addComponent(new BirdSpriteRender());

class RigidbodyJumperWebControls extends DeviceInputBehavior {
    override OnMouseLeftClick() {
        getLogicBehavior<RigidbodyJumper>().Jump();
    }
}

class RigidbodyJumper extends Rigidbody {
    Jump() {
        this.velocity.y = 10;
        this.notifyOutput();
    }
}

class BirdSpriteRender extends SpriteRenderBehavior {
    private const MAX_VISUAL_ROTATION = 45;
    private const MIN_VISUAL_ROTATION = -45;
    private const ROTATION_SPEED = 100;

    constructor() {
        super("bird.png");
        this.observe<RigidbodyJumper>(this.onJump);
    }

    onJump() {
        this.renderOffset.rotation = MAX_VISUAL_ROTATION;
    }

    override tick(deltaTime: number) {
        if (this.renderOffset.rotation > MIN_VISUAL_ROTATION) {
            this.renderOffset.rotation -= deltaTime * ROTATION_SPEED;
        }
    }
}
```